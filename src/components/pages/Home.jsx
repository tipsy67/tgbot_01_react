export default function Home({counter }) {
    return (
        <>
            <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                <div className="flex flex-col">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": 15 } /* as React.CSSProperties */} aria-live="polite" aria-label={counter}>15</span>
                    </span>
                    days
                </div>
                <div className="flex flex-col">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": 10 } /* as React.CSSProperties */} aria-live="polite" aria-label={counter}>10</span>
                    </span>
                    hours
                </div>
                <div className="flex flex-col">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": 24 } /* as React.CSSProperties */} aria-live="polite" aria-label={counter}>24</span>
                    </span>
                    min
                </div>
                <div className="flex flex-col">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": 59 } /* as React.CSSProperties */} aria-live="polite" aria-label={counter}>59</span>
                    </span>
                    sec
                </div>
            </div>
            <div className="text-center px-2 sm:px-4"> {/* Меньшие отступы на мобильных */}
                <div className="card bg-base-100 w-full max-w-[calc(100vw-2rem)] sm:max-w-96 mx-auto shadow-sm">
                    <figure>
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                            alt="Shoes"
                            className="w-full max-h-40 object-cover"
                        />
                    </figure>
                    <div className="card-body p-3 sm:p-4 md:p-6">
                        <h2 className="card-title text-xl justify-center flex-wrap">
                            Card Title
                            <div className="badge badge-secondary text-xs">NEW</div>
                        </h2>
                        <p className="text-base leading-tight">
                            A card component has a figure, a body part, and inside body there are title and actions parts
                        </p>
                        <div className="card-actions justify-center flex-col gap-1 sm:gap-2 mt-2 sm:mt-4">
                            <button className="btn btn-primary btn-md w-full">
                                Купить технику
                            </button>
                            <button className="btn btn-primary btn-md w-full">
                                Спросить консультанта
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}