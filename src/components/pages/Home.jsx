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
    <div className="space-y-4 w-full">
      
      <div className="text-center">
        <div className="card bg-base-100 w-full mx-auto shadow-sm">
          <figure>
            <img
              src="https://basket-13.wbbasket.ru/vol1956/part195682/195682237/images/big/1.webp"
              alt="Shoes"
              className="w-full object-cover" 
            />
          </figure>
          <div className="card-body p-4"> 
            <h2 className="card-title text-lg justify-center flex-wrap"> 
              Card Title
              <div className="badge badge-secondary text-xs">NEW</div>
            </h2>
            <p className="text-sm leading-tight"> 
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="card-actions justify-center flex-col gap-2 mt-2">
              <button className="btn btn-primary btn-lg w-full"> 
                Купить технику
              </button>
              <button className="btn btn-primary btn-lg w-full">
                Спросить консультанта
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-secondary"> 
          До окончания розыгрыша
        </h2>
      </div>

      <div className="grid grid-flow-col gap-3 text-center auto-cols-max justify-center mb-20"> 
        {[
          { value: timeLeft.days, label: 'days' },
          { value: timeLeft.hours, label: 'hours' },
          { value: timeLeft.minutes, label: 'min' },
          { value: timeLeft.seconds, label: 'sec' }
        ].map((item, index) => (
          <div key={index} className="flex flex-col p-2 bg-secondary/50 rounded-box text-neutral-content">
            <span className="countdown font-mono text-3xl"> 
              <span 
                style={{ "--value": item.value }} 
                aria-live="polite" 
                aria-label={`${item.value} ${item.label}`}
              >
                {item.value}
              </span>
            </span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}