// Core
import { FC } from 'react';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { inRange } from 'lodash';
import { v4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Components
import { User } from '../view/components';

// Styles
import { Container } from './styles';

// Types

type userId = string;
type ICookie = { userId: userId };
type visitCounts = number;
type IUser = {
    userId: userId
    visitCounts: visitCounts
};

type PropTypes = {
    text: string,
}

// Tools
const COOKIE_KEY = 'user';
const cookiesOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    path:   '/',
};

const switchHandler = (visitCounts: number): string => {
    switch (true) {
        case inRange(visitCounts, 0, 3): return 'Приветствуем тебя странник!';
        case inRange(visitCounts, 3, 7): return 'Приветствуем тебя друг!';
        case inRange(visitCounts, 7, Infinity): return 'Добро пожаловать в семье!';

        default: return 'Оу шит.';
    }
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
    const cookies = nookies.get(context);
    const cookieUser: ICookie = COOKIE_KEY in cookies ? JSON.parse(cookies.user) : null;

    const parsedJsonUsers: Array<IUser> = JSON.parse(
        fs.readFileSync(path.resolve('src/pages/users.json'), { encoding: 'utf8', flag: 'r' }),
    ) ?? [];

    if (cookieUser && parsedJsonUsers.some(({ userId }) => userId === cookieUser.userId)) {
        let newViewCount = 0;

        const result = parsedJsonUsers.map((mappedUser) => {
            if (mappedUser.userId === cookieUser.userId) {
                newViewCount = mappedUser.visitCounts + 1;

                return {
                    ...mappedUser,
                    visitCounts: newViewCount,
                };
            }

            return mappedUser;
        });

        fs.writeFile(path.resolve('src/pages/users.json'), JSON.stringify(result), (error) => {
            if (error) {
                return console.log('Error writing file: ' + error);
            }
            console.log('writing', { cookieUser, newViewCount });
        });

        nookies.set(context, COOKIE_KEY, JSON.stringify(cookieUser), cookiesOptions);

        return { props: { text: switchHandler(newViewCount) }};
    }

    const userId = v4();
    const newUser = { userId, visitCounts: 1 };
    const newJson = [ ...parsedJsonUsers, newUser ];

    fs.writeFile(path.resolve('src/pages/users.json'), JSON.stringify(newJson), (error) => {
        if (error) {
            return console.log('Error writing file: ' + error);
        }
        console.log('writing', newUser);
    });

    nookies.set(context, COOKIE_KEY, JSON.stringify({ userId }), cookiesOptions);

    return { props: { text: switchHandler(1) }};
};

const Root: FC<PropTypes> = ({ text }) => {
    return (
        <Container>
            <User text = { text }/>
        </Container>
    );
};

export default Root;
