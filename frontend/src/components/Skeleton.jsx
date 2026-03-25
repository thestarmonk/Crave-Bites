import React from 'react';

const Skeleton = ({ className }) => {
    return (
        <div className={`skeleton ${className}`}></div>
    );
};

export const CardSkeleton = () => {
    return (
        <div className="glass-no-hover rounded-[2rem] overflow-hidden border border-white/5 h-full">
            <div className="h-52 skeleton w-full" />
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="h-6 skeleton w-2/3 rounded-lg" />
                    <div className="h-6 skeleton w-12 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 skeleton w-full rounded-md" />
                    <div className="h-3 skeleton w-5/6 rounded-md" />
                </div>
                <div className="flex justify-between items-center pt-4">
                    <div className="h-10 skeleton w-24 rounded-xl" />
                    <div className="h-12 skeleton w-12 rounded-2xl" />
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
