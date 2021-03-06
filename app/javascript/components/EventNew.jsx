import React, { Component } from 'react'
import AddTimeslot from './AddTimeslot'
import TimeslotsPreview from './TimeslotsPreview'

class EventNew extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      durationMinutes: 60,
      locationId: '0',
      locationName: '',
      locationAddress: '',
      timeslots: [],
      errors: {
        nameInvalid: false,
        durationInvalid: false,
        locationInvalid: false,
        noTimeslots: false
      },
      showModal: false
    }

    this.queueTimeslot = this.queueTimeslot.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.removeTimeslot = this.removeTimeslot.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  queueTimeslot(timeslot) {
    this.setState({
      timeslots: [
        ...this.state.timeslots,
        timeslot
      ]})
  }

  removeTimeslot(timeslot) {
    return () => {
      this.setState({
        timeslots: this.state.timeslots.filter( ts => ts !== timeslot )
      })
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal
    })

    document.body.classList.toggle('modal-open')
  }

  validateForm(e) {
    const errors = this.state.errors

    if (this.state.name == '') {
      errors.nameInvalid = 'Event Name is Required'
    } else {
      errors.nameInvalid = false
    }

    if (+this.state.durationMinutes < 15) {
      errors.durationInvalid = 'Duration Must Be at Least 15 Min'
    } else {
      errors.durationInvalid = false
    }

    if (this.state.locationId == '0' &&
      (this.state.locationName == '' || this.state.locationAddress == '')) {

      errors.locationInvalid = 'If Creating New Location, Name and Address Are Required'
    } else {
      errors.locationInvalid = false
    }

    if (this.state.timeslots.length === 0) {
      errors.noTimeslots = 'Event Must Have at Least One Timeslot'
    } else {
      errors.noTimeslots =  false
    }

    if (Object.keys(errors).some( key => errors[key])) {
      this.setState({ errors })
      e.preventDefault()
    }
  }

  render() {
    return (
      <div className='card-container'>
        <form
          method='POST'
          action='/events'
          className='card-body'
          onSubmit={ this.validateForm }
          noValidate
        >
          <input
            type='hidden'
            name='authenticity_token'
            value={ this.props.authToken }
          />
          <input
            type='hidden'
            name='timeslots'
            value={ this.state.timeslots }
          />
          <h1 className='card-title'>Create a New Event</h1>
          <div className='card-fields'>
            <div>
              <label htmlFor='name'>
                Event Name:
              </label>
              <input
                type='text'
                name='name'
                value={ this.state.name }
                onChange={ this.handleChange }
              />
              { this.state.errors.nameInvalid &&
                <div className='error-msg'>
                  { this.state.errors.nameInvalid }
                </div>
              }
            </div>
            <div>
              <label htmlFor='durationMinutes'>
                Duration (in minutes):
              </label>
              <input
                type='number'
                name='durationMinutes'
                min='15'
                value={ this.state.durationMinutes }
                onChange={ this.handleChange }
              />
              { this.state.errors.durationInvalid &&
                <div className='error-msg'>
                  { this.state.errors.durationInvalid }
                </div>
              }
            </div>
            <div>
              <label htmlFor='locationId'>
                Select a Location
              </label>
              <select
                name='locationId'
                value={ this.state.location }
                onChange={ this.handleChange }
              >
                <option value='0'>
                  -- Add a New Location --
                </option>
                {this.props.locations.map((location) =>
                  <option value={ location.id } key={ location.id }>
                    {location.name}
                  </option>
                )}
              </select>
              { this.state.locationId == '0' && this.state.errors.locationInvalid &&
                <div className='error-msg'>
                  { this.state.errors.locationInvalid }
                </div>
              }
            </div>
            <div
              className={`new-location ${ this.state.locationId !== '0' && 'hidden'}`}
            >
              <div>
                <label htmlFor='locationName'>
                  Name of New Location:
                </label>
                <input
                  type='text'
                  name='locationName'
                  value={ this.state.locationName }
                  onChange={ this.handleChange }
                />
              </div>
              <div>
                <label htmlFor='locationAddress'>
                  Address of New Location:
                </label>
                <input
                  type='text'
                  name='locationAddress'
                  value={ this.state.locationAddress }
                  onChange={ this.handleChange }
                />
              </div>
            </div>

            <div className='timeslots-preview-header'>
              <button
                className='queue-new-timeslot btn'
                onClick={(e) => {
                  e.preventDefault()
                  this.toggleModal()
                  }
                }
              >
                +
              </button>
              <label>Timeslots:</label>
            </div>
            <div className='timeslots-preview'>
              { this.state.timeslots.length === 0
                ? <span className='empty-timeslots-message'>
                    Please Add a Timeslot
                  </span>
                : this.state.timeslots
                  .sort((a, b) => new Date(a) - new Date(b))
                  .map( (timeslot, i) =>
                    <TimeslotsPreview
                      key={i}
                      timeslot={timeslot}
                      callback={this.removeTimeslot(timeslot)}
                    />
                )
              }
            </div>
            { this.state.errors.noTimeslots &&
              <div className='error-msg'>
                { this.state.errors.noTimeslots }
              </div>
            }
          </div>
          <input
            type='submit'
            id='card-submit'
            className='btn btn--confirm'
            value='Submit'
          />
        </form>
        {this.state.showModal &&
          <AddTimeslot
            callback={this.queueTimeslot}
            closeModal={this.toggleModal}
            parent="new_event"
            timeslots={this.state.timeslots}
          />
        }
      </div>
    )
  }
}

export default EventNew
