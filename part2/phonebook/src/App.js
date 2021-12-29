import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ query, onQueryChange }) => {
    return (
        <form>
            filter shown with
            <input
                value={query}
                onChange={onQueryChange}
            />
        </form>
    )
}

const PersonForm = (props) => {
    const {
        newName,
        newNumber,
        onAddPerson,
        onNameChange,
        onNumberChange
    } = props

    return (
        <form>
            <div>
                name:
                <input
                    value={newName}
                    onChange={onNameChange}
                />
            </div>
            <div>
                number:
                <input
                    value={newNumber}
                    onChange={onNumberChange}
                />
            </div>
            <div>
                <button
                    type='submit'
                    onClick={onAddPerson}
                >
                    add
                </button>
            </div>
        </form>
    )
}

const Person = ({ person }) => {
    return (
        <p>{person.name} {person.number}</p>
    )
}

const Persons = ({ persons }) => {
    return (
        <div>
            {persons.map(person =>
                <Person key={person.name} person={person} />
            )}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [query, setQuery] = useState('')

    useEffect(() => {
        console.log('effect')
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                console.log('promise fulfilled')
                console.log(`${response.data.length} person(s) got`)
                setPersons(response.data)
            })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()

        if (persons.map(person => person.name).includes(newName)) {
            alert(`${newName} is already added to phone book`)
        } else {
            const personObject = {
                name: newName,
                number: newNumber,
                id: persons.length + 1
            }

            const newPersons = persons.concat(personObject)

            setPersons(newPersons)
            setNewName('')
            setNewNumber('')
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(query.toLowerCase()))

    return (
        <div>
            <h2>Phone Book</h2>

            <Filter
                query={query}
                onQueryChange={handleQueryChange}
            />

            <h3>add a new</h3>

            <PersonForm
                newName={newName}
                newNumber={newNumber}
                onAddPerson={addPerson}
                onNameChange={handleNameChange}
                onNumberChange={handleNumberChange}
            />

            <h3>Numbers</h3>

            <Persons persons={personsToShow} />
        </div>
    )
}

export default App