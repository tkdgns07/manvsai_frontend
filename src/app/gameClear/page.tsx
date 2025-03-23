'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GameOverPage, GameSuccessPage } from '@/components/other/GameClear';

const Main = () => {
    const searchParams = useSearchParams();
    const time = searchParams.get('time');
    const result = searchParams.get('result');

    if (!time || !result) return <div>Loading...</div>;

    return (
        <>
            {result === 'success' ? <GameSuccessPage time={time} /> : <GameOverPage time={time} />}
        </>
    );
}

export default function Page() {
    return (
        <Suspense>
            <Main></Main>
        </Suspense>
    )
}
