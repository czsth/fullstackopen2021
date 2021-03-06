import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

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

const Person = ({ person, onDeleteClick }) => {
    return (
        <tr>
            <td>
                {person.name}
            </td>
            <td>
                {person.number}
            </td>
            <td>
                <button onClick={event => onDeleteClick(event, person)}>
                    delete
                </button>
            </td>
        </tr>
    )
}

const Persons = ({ persons, onDeleteClick }) => {
    return (
        <table>
            <tbody>
                {persons.map(person =>
                    <Person
                        key={person.name}
                        person={person}
                        onDeleteClick={onDeleteClick}
                    />
                )}
            </tbody>
        </table>
    )
}

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={message.type}>
            {message.message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [query, setQuery] = useState('')
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()

        const isExisting = persons.map(person => person.name).includes(newName)
        const msgToOverride = `${newName} is already added to phone book, replace the old number with a new one?`

        if (isExisting && !window.confirm(msgToOverride)) {
            return
        }

        const personObject = {
            name: newName,
            number: newNumber
        }

        if (isExisting) {
            const existingId = persons.filter(person => person.name === newName)[0].id

            personService
                .update(existingId, personObject)
                .then(updatedPerson => {
                    if (updatedPerson === null) {
                        // TODO: dirty fix
                        setNotification({
                            type: 'error',
                            message: `${personObject.name} already removed from server, please refresh page.`
                        })
                        setTimeout(() => {
                            setNotification(null)
                        }, 5000)
                        return
                    }
                    setPersons(persons.map(p =>
                        p.id !== existingId ? p : updatedPerson))
                    setNewName('')
                    setNewNumber('')


                    setNotification({
                        type: 'success',
                        message: `${updatedPerson.name} updated`
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
                .catch(error => {
                    setNotification({
                        type: 'error',
                        message: error.response.data.error
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
        } else {
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')

                    setNotification({
                        type: 'success',
                        message: `Added ${returnedPerson.name}`
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
                .catch(error => {
                    setNotification({
                        type: 'error',
                        message: error.response.data.error
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
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

    const handlePersonDelete = (event, personToDelete) => {
        const msgToDelete = `Delete ${personToDelete.name} ?`

        if (!window.confirm(msgToDelete)) {
            return
        }

        personService
            .remove(personToDelete.id)
            .then(status => {
                console.log(status)
                if (status === 204) {
                    setPersons(persons.filter(person =>
                        person.id !== personToDelete.id))

                    setNotification({
                        type: 'success',
                        message: `${personToDelete.name} successfully deleted`
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                }
            })
            .catch(error => {
                setNotification({
                    type: 'error',
                    message: error.response.data.error
                })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)

            })
    }

    const personsToShow = persons.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div>
            <h2>Phone Book</h2>

            <Notification message={notification} />

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

            <Persons
                persons={personsToShow}
                onDeleteClick={handlePersonDelete}
            />
        </div>
    )
}

export default App