import Hello from 'Components/hello';
import { createClient } from '@/utils/supabase/server'


// Define the type of data you expect from the table
type UserProfile = {
    id: string
    updated_at: string
    username: string
    full_name: string
    avatar_url: string
    sexual_orientation: string
    sex_positive: boolean
    display_disability: boolean
    disability: string[]
    hobbies: string[]
    smoker: boolean
    birthday: string
    gender: string
    need_assistance: boolean
}

export default async function ProfilePage() {
    const supabase = createClient()

    // Fetch data from Supabase
    const { data, error } = await supabase
        .from('profiles') // replace with your actual table name
        .select('*')
        //.eq('username', 'dragon') // replace with the relevant filter

    if (error) {
        console.error('Error fetching data:', error.message)
        return <div>Error loading profile</div>
    }

    if (!data || data.length === 0) {
        return <div>No profile data found</div>
    }

    const profileData = data[0] as UserProfile

    return (
        <div className="profile-page">
            <h1>{profileData.full_name}</h1>
            <img src={profileData.avatar_url} alt="Avatar" />
            <p>Username: {profileData.username}</p>
            <p>Gender: {profileData.gender}</p>
            <p>Birthday: {profileData.birthday}</p>
            <p>Sexual Orientation: {profileData.sexual_orientation}</p>
            <p>Smoker: {profileData.smoker ? 'Yes' : 'No'}</p>
            <p>Disabilities: {profileData.display_disability ? profileData.disability.join(', ') : 'None'}</p>
            <p>Hobbies: {profileData.hobbies.join(', ')}</p>
            <p>Needs Assistance: {profileData.need_assistance ? 'Yes' : 'No'}</p>
        </div>
    )
}
