import React from 'react';
import classNames from 'classnames';
import { times } from 'lodash-es';
import { format as formatDate, isSameDay, getDaysInMonth } from 'date-fns';

import styles from './css/DayList.scss';

// interfaces
// import { ITextMap } from '~/interfaces/App';
import { ITextMap } from '../interfaces/App';

interface IProps {
  /** 表示する月 */
  targetMonth: Date;
  /** 選択した日 */
  selectedDate: Date;
  /** テキスト一覧 */
  textMap: ITextMap;
  /** 日付を選択した時 */
  onChangeSelectedDate: (newDate: Date) => void;
}

const DayList = (props: IProps) => {
  const year = props.targetMonth.getFullYear();
  const month = props.targetMonth.getMonth();
  const numDays = getDaysInMonth(props.targetMonth);

  return (
    <div className={styles.list}>
      {times(numDays).map((day) => {
        const date = new Date(year, month, day + 1);
        const title = (props.textMap[formatDate(date, 'yyyyMMdd')] || '').split('\n')[0];
        return (
          <div key={day} className={styles.list__item}>
            <div
              className={classNames(styles.day, {
                [styles._selected]: isSameDay(date, props.selectedDate),
              })}
              onClick={() => { props.onChangeSelectedDate(date); }}
            >
              <div className={styles.day__date}>{formatDate(date, 'yyyy/MM/dd')}</div>
              <div className={styles.day__text}>{title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayList;
