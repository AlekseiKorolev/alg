import { ChangeEvent, useState } from 'react';

import './Task.css';

import { Task } from '../../models/task'

const TaskComponent = ({ item }: { item: Task }) => {
    const [info, setInfo] = useState<boolean>(true);

    const [value, setValue] = useState<number[][]>([[]]);
    const [stringValue, setStringValue] = useState<string>('');

    const [result, setResult] = useState<{ val: number; rule: number; error?: boolean }[][]>([[]]);
    
    const [check, setCheck] = useState<number[][]>([[]]);
    const [stringCheck, setStringCheck] = useState<string>('');
    
    const [canCheck, setCanCheck] = useState<boolean>(false);

    const [isRight, setIsRight] = useState<string>('');

    const changeValue = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStringValue(value);
        try {
            const res = JSON.parse(value);
            if (Array.isArray(res)) {
                setValue(res);
                setResult([]);
                setIsRight('');
                setStringCheck('');
                setCheck([[]]);
                setCanCheck(false);
            }
        } catch (e) {
            console.warn('cannot parse to array');
        }
    }

    const changeCheck = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStringCheck(value);
        try {
            const res = JSON.parse(value);
            if (Array.isArray(res)) {
                setCheck(res);
                setCanCheck(true);
            }
        } catch (e) {
            console.warn('cannot parse to array');
            setCanCheck(false);
        }

    }

    const checkIt = () => {
        const resForCheck =  result.map(x => x.map(y => y.val));
        const res = stringCheck === JSON.stringify(resForCheck);

        if (!res) {
            const newRes = result.map(x => [...x]);
            for (let i = 0; i < newRes.length; i++) {
                for (let j = 0; j < newRes[i].length; j++) {
                    if (newRes[i][j].val !== check[i][j]) {
                        newRes[i][j].error = true;
                    }
                }
            }
            setResult(newRes);
        }
        setIsRight(res ? 'Right answer' : 'Wrong answer');
    }

    const tryIt = () => {
        const resultValue = value.map(x => x.map(y => ({ val: y, rule: 0 })));

        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < value[i].length; j++) {
                const numOfNeighb = getNumberOfNeighbors(i, j, value);
                if (resultValue[i][j].val === 1) {
                    if (numOfNeighb < 2) {
                        resultValue[i][j].val = 0;
                        resultValue[i][j].rule = 1;
                    } else if (numOfNeighb < 4) {
                        resultValue[i][j].val = 1;
                        resultValue[i][j].rule = 2;
                    } else if (numOfNeighb > 3) {
                        resultValue[i][j].val = 0;
                        resultValue[i][j].rule = 3;
                    }
                } else {
                    if (numOfNeighb === 3) {
                        resultValue[i][j].val = 1;
                        resultValue[i][j].rule = 4;
                    }
                }
            }
        }
        setResult(resultValue);
    }

    const getNumberOfNeighbors = (i: number, j: number, value: number[][]) => {
        let num = 0;
        for (let ii = i - 1; ii <= i + 1; ii++) {
            for (let jj = j - 1; jj <= j + 1; jj++) {
                if (ii === i && jj === j) {
                    continue;
                }
                if (value?.[ii]?.[jj] === 1) {
                    num++;
                }
            }
        }
        return num;
    }

    const columDir = () => {
        return value.length > 10;
    }

    return (
        <div className="task-container">
            <div className="item main-title">{item?.title}</div>
            {info ? <div className="info">
                <div className="item title" onClick={() => setInfo(!info)}>Task</div>
                <div className="item task">
                    {item?.task?.map(x => <div>{x}</div>)}
                </div>
                <div className="item rules">
                    {item?.rules?.map(x => <div>{x}</div>)}
                </div>
                <div className="item task">{item?.text}</div>
                <div className="item title">Constraints</div>
                <div className="item constraints">
                    {item?.constraints?.map(x => <div>{x}</div>)}
                </div>
                <div className="item title">Follow up</div>
                <div className="item follow-up">{item?.followUp}</div>
                <div className="item title">Examples</div>
                {item?.testCases?.map((x, i) => (
                    <div className="item test-cases">
                        <div>Input: {JSON.stringify(x)}</div>
                        <div>Output: {JSON.stringify(item?.results?.[i])}</div>
                    </div>
                ))}
            </div>
                : <div className="info" onClick={() => setInfo(!info)}>Info (click to expand)</div>}

            <div className="input-data">
                <span>Input</span><input value={stringValue} onChange={(e) => changeValue(e)}></input>
                <button onClick={() => tryIt()}>Try It</button>
            </div>

            <div className="input-data">
                <span>Expected</span><input value={stringCheck} onChange={(e) => changeCheck(e)}></input>
                <button disabled={!canCheck} onClick={() => checkIt()}>Check It</button>
            </div>

            <div className="verify">{isRight}</div>

            <div className={`show-box ${columDir() ? "column" : ""}`}>
                <div className="input-box">
                    {value.map((x: any, i: number) => (
                        <div key={`inputbox-row${i}`} className="row">
                            {x.map((y: any, j: number) => <div key={`inputbox-cell${i}${j}`} className="cell">{y}</div>)}
                        </div>
                    ))}
                </div>
                {result && <div className="out-box">
                    {result.map((x: any, i: number) => (
                        <div key={`outbox-row${i}`} className="row">
                            {x.map((y: any, j: number) => (
                                <div key={`outbox-cell${i}${j}`} className={`cell color${y.rule} ${y.error ? "error" : ""}`}>{y.val}</div>)
                            )}
                        </div>
                    ))}
                </div>}
            </div>

            <div>

            </div>
        </div>
    )
}

export default TaskComponent;