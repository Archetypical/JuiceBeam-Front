// ** React Import
import React, { useState } from 'react'


// ** Custom Components
import Sidebar from '../sidebar'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
import { adminActions } from '../../../../../../_actions/admin.actions'
import { useDispatch } from 'react-redux'

const defaultValues = {
  email: '',
  username: '',
  password: ''
}


const checkIsValid = data => {
  return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
}

const NewSidebar = ({ open, toggleSidebar }) => {
  // ** States
  const [data, setData] = useState(null)
  const [rank, setRank] = useState('Dreamer')
  const [role, setRole] = useState('User')

  // ** Store Vars
  const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = data => {
    setData(data)
    if (checkIsValid(data)) {
      toggleSidebar()
      dispatch(
        adminActions.addNewUser({
          role,
          username: data.username,
          email: data.email,
          password: data.password,
          points: data.points,
          rank: rank,
        })
      )
    } else {
      for (const key in data) {
        if (data[key] === null) {
          setError('country', {
            type: 'manual'
          })
        }
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
    setRole('User');
    setRank('Dreamer');
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title='New User'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='username'>
            Username <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <Input id='username' placeholder='johnDoe99' invalid={errors.username && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='userEmail'>
            Email <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='email'
                id='userEmail'
                placeholder='john.doe@example.com'
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          <FormText color='muted'>You can use letters, numbers & periods</FormText>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='password'>
            Password <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <Input type='password' id='password' placeholder='Password' invalid={errors.password && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='user-role'>
            User Role
          </Label>
          <Input type='select' id='user-role' name='user-role' value={role} onChange={e => setRole(e.target.value)}>
            <option value='User'>User</option>
            <option value='Moderator'>Moderator</option>
            <option value='Admin'>Admin</option>
          </Input>
        </div>
        <div className='mb-1' value={rank} onChange={e => setRank(e.target.value)}>
          <Label className='form-label' for='select-rank'>
            Select Rank
          </Label>
          <Input type='select' id='select-rank' name='select-rank'>
            <option value='Dreamer'>Dreamer</option>
            <option value='Heartbeat'>Heartbeat</option>
            <option value='Insightful'>Insightful</option>
            <option value='Lucid'>Lucid</option>
            <option value='Visionary'>Visionary</option>
            <option value='Enlightened'>Enlightened</option>
          </Input>
        </div>
        <Button type='submit' className='me-1' color='primary'>
          Submit
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default NewSidebar
