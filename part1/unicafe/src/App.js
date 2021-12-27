import React, { useState } from 'react'

const Header = ({ text }) => {
    return (
        <h1>{text}</h1>
    )
}

const Button = ({ text, onClick }) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}

const StatisticLine = ({ name, value }) => {
    return (
        <tr>
            <td>{name}</td>
            <td>{value}</td>
        </tr>
    )
}

const Statistics = ({ feedbacks }) => {

    const all = feedbacks.reduce((total, { value }) => (total + value), 0)
    const ranks = feedbacks.reduce((total, { value, rank }) => (total + value * rank), 0)
    const avg = ranks / all
    const pos = feedbacks[0].value / all

    if (all <= 0) {
        return (
            <>
                <Header text='statistics' />
                <p>No feedback given</p>
            </>
        )
    }

    return (
        <>
            <Header text='statistics' />
            <table>
                <StatisticLine name={feedbacks[0].name} value={feedbacks[0].value} />
                <StatisticLine name={feedbacks[1].name} value={feedbacks[1].value} />
                <StatisticLine name={feedbacks[2].name} value={feedbacks[2].value} />
                <StatisticLine name='all' value={all} />
                <StatisticLine name='average' value={avg} />
                <StatisticLine name='pos' value={pos * 100 + '%'} />
            </table>
        </>
    )
}

const App = () => {
    // save clicks of each button to own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const feedbacks = [
        {
            name: 'good',
            rank: 1,
            value: good,
        },
        {
            name: 'neutral',
            rank: 0,
            value: neutral,
        },
        {
            name: 'bad',
            rank: -1,
            value: bad,
        },
    ]



    const setToValue = (setter, newValue) => () => {
        setter(newValue)
    }

    return (
        <div>
            <Header text='give feedback' />
            <Button text='good' onClick={setToValue(setGood, good + 1)} />
            <Button text='neutral' onClick={setToValue(setNeutral, neutral + 1)} />
            <Button text='bad' onClick={setToValue(setBad, bad + 1)} />

            <Statistics feedbacks={feedbacks} />
        </div>
    )
}

export default App