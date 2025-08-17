import type { FC } from "react";
import { createRef, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { times } from "es-toolkit/compat";
import { formatDate, isSameDay, getDaysInMonth, addDays } from "date-fns";

import styles from "./DayList.module.scss";
import type { DiaryTextMap } from "../../types/DiaryTextMap";

type DayListProps = {
  /** 表示する月 */
  targetMonth: Date;
  /** 選択した日 */
  selectedDate: Date;
  /** テキスト一覧 */
  textMap: DiaryTextMap;
  /** 日付を選択した時 */
  onChangeSelectedDate: (newDate: Date) => void;
};

export const DayList: FC<DayListProps> = ({
  targetMonth,
  selectedDate,
  textMap,
  onChangeSelectedDate,
}) => {
  const year = targetMonth.getFullYear();
  const month = targetMonth.getMonth();
  const numDays = getDaysInMonth(targetMonth);

  const els = useRef<React.RefObject<HTMLDivElement | null>[]>([]);
  times(numDays).forEach((i) => {
    els.current[i] = createRef<HTMLDivElement | null>();
  });

  useEffect(() => {
    const day = selectedDate.getDate();
    els.current[day - 1].current?.focus();
  }, []);

  return (
    <div className={styles.list}>
      {times(numDays).map((index) => {
        const date = new Date(year, month, index + 1);
        const title = (textMap[formatDate(date, "yyyyMMdd")] || "").split(
          "\n"
        )[0];
        return (
          <div key={index} className={styles.list__item}>
            <div
              ref={els.current[index]}
              tabIndex={0}
              className={clsx(styles.day, {
                [styles._selected]: isSameDay(date, selectedDate),
              })}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp" && index > 0) {
                  event.preventDefault();
                  els.current[index - 1].current?.focus();
                  onChangeSelectedDate(addDays(date, -1));
                  return;
                }
                if (event.key === "ArrowDown" && index < numDays - 1) {
                  event.preventDefault();
                  els.current[index + 1].current?.focus();
                  onChangeSelectedDate(addDays(date, 1));
                  return;
                }
              }}
              onClick={() => {
                onChangeSelectedDate(date);
              }}
            >
              <div className={styles.day__date}>
                {formatDate(date, "yyyy/MM/dd")}
              </div>
              <div className={styles.day__text}>{title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
