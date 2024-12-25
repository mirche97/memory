import React, { useState, useEffect } from 'react';

function Timer(props) {
    const [timeLeft, setTimeLeft] = useState(props.timeInSeconds || 120); // 2 minuten in seconden
    const [isRunning, setIsRunning] = useState(true);

    // Start de timer
    const startTimer = () => setIsRunning(true);

    // Pauzeer de timer
    const pauseTimer = () => setIsRunning(false);

    // Reset de timer
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(props.timeInSeconds || 120);
    };

    // Gebruik useEffect om de timer te laten aftellen
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsRunning(false);
                    alert("Tijd is op!");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Opruimen van de interval
        return () => clearInterval(interval);
    }, [isRunning]);

    // Berekening van minuten en seconden
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div>
            <div style={{ fontSize: '2em' }}>{formattedTime}</div>
            {props.showBtn &&
            <div className={"buttons"}>
                {props.showBtn['start'] && <button onClick={startTimer}>Start</button>}
                {props.showBtn['pause'] && <button onClick={pauseTimer}>Pauze</button>}
                {props.showBtn['reset'] && <button onClick={resetTimer}>Reset</button>}
            </div>}
        </div>
    );
}

export default Timer;
