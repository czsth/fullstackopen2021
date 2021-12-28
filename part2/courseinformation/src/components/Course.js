import React from 'react'

const Header = ({ course }) => {
    return (
        <h3>{course.name}</h3>
    )
}

const Total = ({ course }) => {
    const sum = course.parts.reduce(
        (pre, cur) => pre + cur.exercises, 0
    )

    return (
        <strong>Total of {sum} exercises</strong>
    )
}

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}

const Content = ({ course }) => {
    return (
        <div>
            {course.parts.map(
                part => <Part key={part.id} part={part} />
            )}
        </div>
    )
}

const Course = ({ course }) => {
    return (
        <>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </>
    )
}

export default Course