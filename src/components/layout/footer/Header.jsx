export default function Header({ entrantID, tickets, onTicketsChange, status, onStatusChange, ...props }) {
    return (
        <header className="w-full sticky top-0 z-50">
            <ul className="menu menu-horizontal bg-base-200 bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg flex-nowrap whitespace-nowrap w-full justify-between px-6">
                <li className="disabled">
                    <a>
                        ID: {entrantID}
                    </a>
                </li>
                <li>
                    <a onClick={onTicketsChange}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                        </svg>
                        <span className="badge badge-sm badge-success">
                            {tickets}
                        </span>
                    </a>
                </li>
                <li>
                    <a onClick={onStatusChange}>
                        Статус
                        {status? (
                            <div className="badge badge-success">
                                <svg className="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2"></circle>
                                        <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2"></polyline>
                                    </g>
                                </svg>
                            </div>
                        ) : (
                            <div className="badge badge-error animate-pulse">
                                <svg className="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g fill="currentColor">
                                        <rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)" fill="currentColor" strokeWidth={0}></rect>
                                        <path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z" strokeWidth={0} fill="currentColor"></path>
                                    </g>
                                </svg>
                            </div>
                        )}
                    </a>
                </li>
            </ul>
        </header>
    )
}