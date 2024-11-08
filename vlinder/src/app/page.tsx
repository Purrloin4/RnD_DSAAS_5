import Hello from 'Components/hello';
import {Card, CardBody} from "@nextui-org/react";

function Page() {

    return (
      <div className='w-1/2 h-1/2'>
      <Card>
        <CardBody>
          <p>Make beautiful websites regardless of your design experience.</p>
        </CardBody>
      </Card>
      </div>
    );
}

export default Page;