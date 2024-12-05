// import { login, signup } from './actions';

// import { Button, Input } from "@nextui-org/react";

// export default function LoginPage() {
//   const widthClass = "w-[70%]"; 
//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="flex flex-col items-center space-y-4 w-full">
//         <Input
//           type="text"
//           label="Email/Phone number"
//           placeholder="Enter your email or phone number"
//           className={widthClass}
//         />

//         <Input
//           type="password"
//           label="Password"
//           placeholder="Enter your password"
//           className={widthClass}
//         />

//         <Button
          
//           size="lg"
//           className={`${widthClass} bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg py-3`}
//           aria-label="login-button"
//         >
//           Login
//         </Button>
//       </div>
//     </div>
//   );
// }
import { Input, Card, Button, Spacer } from '@nextui-org/react';
import { login, signup } from './actions';

export default function LoginPage() {
  return (
 
<form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
   
  ) 
}