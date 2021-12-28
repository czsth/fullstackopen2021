import React, { useState } from 'react'

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
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [query, setQuery] = useState('')

    const addPerson = (event) => {
        event.preventDefault()

        if (persons.map(person => person.name).includes(newName)) {
            alert(`${newName} is already added to phonebook`)
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
            <h2>Phonebook</h2>

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