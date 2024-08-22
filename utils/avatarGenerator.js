import { createAvatar } from '@dicebear/core';
import * as thumbs from '@dicebear/thumbs';

const generateRandomString = (length) =>  {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
    let result = '';
    const charsetLength = charset.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        result += charset[randomIndex];
    }
    return result;
}

const generateAvatar = () => {
    const avatar = createAvatar(thumbs, {
        seed: generateRandomString(10),
        backgroundColor: ["383838"],
        shapeColor: ["99C35F"],
        radius: 50,
        scale: 80
    });
    
    return avatar.toString(); 
};

export default generateAvatar;