import { FC } from 'react';

// Types
import { ComponentProps } from '../types';

export const User: FC<ComponentProps> = ({ text }) => {
    return (
        <h1>{text ?? 'Это фиаско.'}</h1>
    );
};
