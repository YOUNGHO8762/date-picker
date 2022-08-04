import {
  addDays,
  addMonths,
  areIntervalsOverlapping,
  format,
  getDaysInMonth,
  isAfter,
  isEqual,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { useState } from 'react';
import styled from 'styled-components';

interface StayPeriod {
  checkIn: Date;
  checkOut: Date;
}

type StayStatus = 'checkInOut' | 'staying' | 'notStaying';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stayPeriod, setStayPeriod] = useState<StayPeriod>({
    checkIn: new Date(),
    checkOut: addDays(new Date(), 1),
  });

  const daysInMonth = getDaysInMonth(selectedDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    return i + 1;
  });
  const blankDays = Array(startOfMonth(selectedDate).getDay()).fill('');

  const handleDayClick = (day: number) => {
    const enteredDate = new Date(selectedDate.setDate(day));
    if (
      isAfter(stayPeriod.checkIn, enteredDate) ||
      isEqual(stayPeriod.checkOut, enteredDate)
    ) {
      setStayPeriod({ checkIn: enteredDate, checkOut: enteredDate });
      return;
    }
    setStayPeriod({ ...stayPeriod, checkOut: enteredDate });
  };

  const MoveToDate = (direction: 'previous' | 'next') => {
    const movedDate =
      direction === 'previous'
        ? subMonths(selectedDate, 1)
        : addMonths(selectedDate, 1);
    setSelectedDate(movedDate);
  };

  const CheckIsStayPeriod = (enteredDay: number): StayStatus => {
    const enteredDate = new Date(selectedDate.setDate(enteredDay));
    const isCheckInOut =
      isEqual(stayPeriod.checkIn, enteredDate) ||
      isEqual(stayPeriod.checkOut, enteredDate);
    const isStay = areIntervalsOverlapping(
      {
        start: stayPeriod.checkIn,
        end: stayPeriod.checkOut,
      },
      { start: enteredDate, end: enteredDate }
    );

    const stayStatus =
      (isCheckInOut && 'checkInOut') || (isStay && 'staying') || 'notStaying';

    return stayStatus;
  };

  return (
    <Container>
      <div>
        <Button onClick={() => MoveToDate('previous')}>-</Button>
        {format(selectedDate, 'yyyy-MM')}
        <Button onClick={() => MoveToDate('next')}>+</Button>
      </div>
      <div>
        <CalendarContainer>
          <div>일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div>토</div>
          {blankDays.map((blank, i) => {
            return <div key={i}>{blank}</div>;
          })}
          {days.map((day) => {
            return (
              <Day
                key={day}
                isStay={CheckIsStayPeriod(day)}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </Day>
            );
          })}
        </CalendarContainer>
      </div>
      <div>체크인 : {format(stayPeriod.checkIn, 'yyyy-MM-dd')}</div>
      <div>체크아웃 : {format(stayPeriod.checkOut, 'yyyy-MM-dd')}</div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100vw;
  text-align: center;
`;

const Button = styled.button`
  cursor: pointer;
`;

const Day = styled.div<{ isStay: StayStatus }>`
  color: ${(props) =>
    (props.isStay === 'checkInOut' && 'red') ||
    (props.isStay === 'staying' && 'pink') ||
    'black'};
  cursor: pointer;

  &:hover {
    background-color: gray;
  }
`;
