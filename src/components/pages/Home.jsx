import useCountdown from "../../hooks/Counters";

export default function Home({ targetDate }) {
  const timeLeft = useCountdown(targetDate);

  if (timeLeft.isExpired) {
    return (
      <div className="alert alert-success">
        <span>Событие началось!</span>
      </div>
    );
  }

  return (
    <>
      <div className="text-center px-2 sm:px-4">
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
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>            <p className="text-base leading-tight">
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>            <p className="text-base leading-tight">
              A card component has a figure, a body part, and inside body there
              are title and actions parts
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

      <div className="justify-center mt-8">
        <h2 className="card-title text-xl justify-center flex-wrap text-secondary">
          До окончания розыгрыша
        </h2>
      </div>

      <div className="justify-center mt-8 grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col p-2 bg-secondary/50 rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span 
            style={{ "--value": timeLeft.days }} 
            aria-live="polite" 
            aria-label={`${timeLeft.days} days`}
          >
            {timeLeft.days}
          </span>
        </span>
        days
      </div>
      
      <div className="flex flex-col p-2 bg-secondary/50 rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span 
            style={{ "--value": timeLeft.hours }} 
            aria-live="polite" 
            aria-label={`${timeLeft.hours} hours`}
          >
            {timeLeft.hours}
          </span>
        </span>
        hours
      </div>
      
      <div className="flex flex-col p-2 bg-secondary/50 rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span 
            style={{ "--value": timeLeft.minutes }} 
            aria-live="polite" 
            aria-label={`${timeLeft.minutes} minutes`}
          >
            {timeLeft.minutes}
          </span>
        </span>
        min
      </div>
      
      <div className="flex flex-col p-2 bg-secondary/50 rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span 
            style={{ "--value": timeLeft.seconds }} 
            aria-live="polite" 
            aria-label={`${timeLeft.seconds} seconds`}
          >
            {timeLeft.seconds}
          </span>
        </span>
        sec
      </div>
      </div>
    </>
  );
}
