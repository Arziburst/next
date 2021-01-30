
// Core
import { FC } from 'react';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { inRange } from 'lodash';
import { v4 } from 'uuid';

// Components
import { User } from '../view/components';

// Styles
import { Container } from './styles';

// Types
type IUserCookie = {
    visitCounts: number,
    userId: string,
}

type PropTypes = {
    text: string
}

// Tools
const COOKIE_KEY = 'user';
const cookiesOptions = {
    maxAge: 30 * 24 * 60 * 60,
    path:   '/',
};

const switchHandler = ({ visitCounts }: IUserCookie) => {
    switch (true) {
        case inRange(visitCounts, 0, 3): return 'Приветствуем тебя странник!';
        case inRange(visitCounts, 3, 7): return 'Приветствуем тебя друг!';
        case inRange(visitCounts, 7, Infinity): return 'Добро пожаловать в семье!';

        default: return 'Оу шит.';
    }
};

// fs.exists('myjsonfile.json', function (exists: boolean) {
//     console.log('🚀 ~ file: index.tsx ~ line 70 ~ exists', exists);
// });

export const getServerSideProps = (context: GetServerSidePropsContext) => {
    const cookies = nookies.get(context);
    const user: IUserCookie = COOKIE_KEY in cookies ? JSON.parse(cookies.user) : null;

    if (user) {
        const newVersion = { ...user, visitCounts: user.visitCounts + 1 };
        nookies.set(context, COOKIE_KEY, JSON.stringify(newVersion), cookiesOptions);

        return { props: { text: switchHandler(newVersion) }};
    }

    const newUserCookie = { userId: v4(), visitCounts: 0 };
    nookies.set(context, COOKIE_KEY, JSON.stringify(newUserCookie), cookiesOptions);

    return { props: { text: switchHandler(newUserCookie) }};
};

const Root: FC<PropTypes> = ({ text }) => {
    return (
        <Container>
            <User text = { text }/>
        </Container>
    );
};

export default Root;
