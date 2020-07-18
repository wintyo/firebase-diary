import React, { useRef } from 'react';
import classNames from 'classnames';
import { times } from 'lodash-es';
import { format as formatDate, isSameDay, getDaysInMonth, addDays } from 'date-fns';

import styles from './css/DayList.scss';

// interfaces
import { ITextMap } from '~/interfaces/App';

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

  const els = useRef<React.RefObject<HTMLDivElement>[]>([]);
  times(numDays).forEach((i) => {
    els.current[i] = React.createRef<HTMLDivElement>();
  });
  return (
    <div className={styles.list}>
      {times(numDays).map((index) => {
        const date = new Date(year, month, index + 1);
        const title = (props.textMap[formatDate(date, 'yyyyMMdd')] || '').split('\n')[0];
        return (
          <div key={index} className={styles.list__item}>
            <div
              ref={els.current[index]}
              tabIndex={0}
              className={classNames(styles.day, {
                [styles._selected]: isSameDay(date, props.selectedDate),
              })}
              onKeyDown={(event) => {
                event.preventDefault();
                if (event.key === 'ArrowUp' && index > 0) {
                  els.current[index - 1].current?.focus();
                  props.onChangeSelectedDate(addDays(date, -1));
                  return;
                }
                if (event.key === 'ArrowDown' && index < numDays - 1) {
                  els.current[index + 1].current?.focus();
                  props.onChangeSelectedDate(addDays(date, 1));
                  return;
                }
              }}
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
