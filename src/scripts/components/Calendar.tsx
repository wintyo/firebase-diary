import React from 'react';
import classNames from 'classnames';
import styles from './css/Calendar.scss';

import { range, flatten } from 'lodash';
import { format as formatDate, isSameDay, addMonths } from 'date-fns';

// interfaces
import { ITextMap } from '~/interfaces/App';

const DAY_NAME_LIST = ['日', '月', '火', '水', '木', '金', '土'];  // 日付リスト

/**
 * カレンダーリストを作る
 * @param {number} year - 年
 * @param {number} month - 月
 * @param {number} offset - 開始の日（日曜日スタートがoffset:0で、月曜日からにする場合はoffset:1にする）
 * @returns {Array} - 2次元配列のカレンダーリスト
 */
function createCalendarList(year: number, month: number, offset = 0) {
  // 前月の日を埋める
  const prevPaddingDays = (() => {
    const firstDay = (new Date(year, month)).getDay();
    // 埋める日数を求める（日曜日スタートがoffset:0で、月曜日からにする場合はoffset:1にする）
    const paddingDayCount = (firstDay + 7 - offset) % 7;
    const prevLastDate = (new Date(year, month, 0)).getDate();
    return range(prevLastDate - paddingDayCount + 1, prevLastDate + 1).map((day) => ({
      date: new Date(year, month - 1, day),
      day,
      isPrev: true,
      isNext: false,
    }));
  })();

  // 今月の日にちリストを生成する
  const currentDays = (() => {
    const lastDate = new Date(year, month + 1, 0);
    const currentDayCount = lastDate.getDate();
    return range(1, currentDayCount + 1).map((day) => ({
      date: new Date(year, month, day),
      day,
      isPrev: false,
      isNext: false,
    }));
  })();

  // 来月の日を埋める
  const nextPaddingDays = (() => {
    const paddingDayCount = (42 - (prevPaddingDays.length + currentDays.length));
    return range(1, paddingDayCount + 1).map((day) => ({
      date: new Date(year, month + 1, day),
      day,
      isPrev: false,
      isNext: true,
    }));
  })();

  // 結合する
  const flatCalendar = [
    ...prevPaddingDays,
    ...currentDays,
    ...nextPaddingDays,
  ];

  // 2次元配列にして返す
  return range(0, flatCalendar.length / 7).map((i) => {
    return flatCalendar.slice(i * 7, (i + 1) * 7);
  });
}

interface IProps {
  /** 表示する月 */
  targetMonth: Date;
  /** テキスト情報 */
  textMap: ITextMap;
  /** 曜日のオフセット（日曜日スタートがoffset:0で、月曜日からにする場合はoffset:1にする） */
  offset: number;
  /** 選択した日 */
  selectedDate: Date;
  /** 月を変更する時 */
  onChangeMonth: (newMonth: Date) => void;
  /** 選択日の変更 */
  onChangeSelectedDate: (newDate: Date) => void;
}

const Calender = (props: IProps) => {
  const dayNameList = DAY_NAME_LIST.map((DAY_NAME, index) => DAY_NAME_LIST[(index + props.offset) % DAY_NAME_LIST.length]);
  const calendarList = flatten(createCalendarList(props.targetMonth.getFullYear(), props.targetMonth.getMonth(), props.offset));

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button
          onClick={() => { props.onChangeMonth(addMonths(props.targetMonth, -1)); }}
        >
          ←
        </button>
        <div>{formatDate(props.targetMonth, 'yyyy年MM月')}</div>
        <button
          onClick={() => { props.onChangeMonth(addMonths(props.targetMonth, 1)); }}
        >
          →
        </button>
      </div>
      <div className={styles.table}>
        {dayNameList.map((dayName, index) => (
          <div
            key={index}
            className={styles.table__cell}
          >
            <div className={styles.day}>{dayName}</div>
          </div>
        ))}
        {calendarList.map((calendarCell, index) => (
          <div
            key={index}
            className={styles.table__cell}
            onClick={() => {
              if (calendarCell.isPrev || calendarCell.isNext) {
                const moveValue = calendarCell.isPrev ? -1 : 1;
                props.onChangeMonth(addMonths(props.targetMonth, moveValue));
                props.onChangeSelectedDate(calendarCell.date);
                return;
              }
              props.onChangeSelectedDate(calendarCell.date);
            }}
          >
            <div className={classNames(styles.day, {
              [styles._inputted]: !!props.textMap[formatDate(calendarCell.date, 'yyyyMMdd')],
              [styles._other]: calendarCell.isPrev || calendarCell.isNext,
              [styles._selected]: !calendarCell.isPrev && !calendarCell.isNext && isSameDay(calendarCell.date, props.selectedDate),
            })}>
              {calendarCell.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};
Calender.defaultProps = {
  offset: 0,
};

export default Calender;
