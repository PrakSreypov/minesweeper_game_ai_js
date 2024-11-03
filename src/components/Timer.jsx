// import React, { useState, useEffect } from "react";
// let timeIntervalId;
// export default function Timer({ gameOver, sendTime }) {
//   let [time, setTime] = useState(0);

//   useEffect(() => {
//     function incrementTime() {
//       setTimeout(() => {
//         let newTime = time + 1;
//         setTime(newTime);
//       }, 1000);
//     }
//     incrementTime();
//   }, [time]);

//   console.log(timeIntervalId);
//   return (
//     <div style={{ color: "white", fontSize: 20, background: "maroon" }}>
//       <span role="img" aria-label="clock" style={{ paddingRight: 10 }}>
//         ⏰
//       </span>
//       {time}
//     </div>
//   );
// }

const Timer = ({ time }) => {
    return (
        <div>
            Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
        </div>
    );
};

export default Timer;
