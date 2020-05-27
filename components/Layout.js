import React from 'react';
import Link from 'next/link';

export default function Layout({ children }){
    return(
        <div className="w-screen h-screen">
            <div className="py-1 px-2 h-8">
                <Link href="/home">
                    <a  className="font-semibold tracking-wide">Movie Cricket</a>
                </Link>
            </div>
            {children}
        </div>
    )
}