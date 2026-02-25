import React from 'react';
import { Avatar as FlowbiteAvatar } from 'flowbite-react';



const Avatar = ({ name }) => {

    const initial = name ? name[0] : 'U';

    return (
        <div className='flex flex-wrap-gap-2'>
            <FlowbiteAvatar rounded bordered placeholderInitials={initial} size='md' className='cursor-pointer transition-transform hover:scale-105'/>
        </div>
    )
}

export default Avatar;

