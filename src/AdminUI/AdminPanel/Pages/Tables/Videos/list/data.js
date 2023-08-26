
// ** Store & Actions
import { adminActions } from "../../../../../../_actions"
import { useSelector, useDispatch } from 'react-redux'


// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'



// ** Vars
const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

const status = {
  1: { title: 'Current', color: 'light-primary' },
  2: { title: 'Professional', color: 'light-success' },
  3: { title: 'Rejected', color: 'light-danger' },
  4: { title: 'Resigned', color: 'light-warning' },
  5: { title: 'Applied', color: 'light-info' }
}

export let data
//const dispatch = useDispatch();


// ** Table Zero Config Column
export const basicColumns = [
  {
    name: 'ID',
    sortable: true,
    maxWidth: '100px',
    selector: row => row.id
  },
  {
    name: 'Title',
    sortable: true,
    minWidth: '225px',
    selector: row => row.Title
  },
  {
    name: 'Date',
    sortable: true,
    minWidth: '310px',
    selector: row => row.date
  },
  {
    name: 'ResourceID',
    sortable: true,
    minWidth: '250px',
    selector: row => row.resourceId
  },
  {
    name: 'Thumbnail',
    sortable: true,
    minWidth: '100px',
    selector: row => row.thumbnail
  },
]
// ** Table ReOrder Column
export const reOrderColumns = [
  {
    name: 'ID',
    sortable: true,
    maxWidth: '100px',
    selector: row => row.id
  },
  {
    name: 'Title',
    sortable: true,
    minWidth: '225px',
    selector: row => row.title
  },
  {
    name: 'Date',
    sortable: true,
    minWidth: '310px',
    selector: row => row.date
  },
  {
    name: 'ResourceID',
    sortable: true,
    minWidth: '250px',
    selector: row => row.resourceId
  },
  {
    name: 'Thumbnail',
    sortable: true,
    minWidth: '100px',
    selector: row => row.thumbnail
  },
]

// ** Expandable table component
/* const ExpandableTable = ({ data }) => {
  return (
    <div className='expandable-content p-2'>
      <p>
        <span className='fw-bold'>City:</span> {data.city}
      </p>
      <p>
        <span className='fw-bold'>Experience:</span> {data.experience}
      </p>
      <p className='m-0'>
        <span className='fw-bold'>Post:</span> {data.post}
      </p>
    </div>
  )
} */


// ** Table Server Side Column
export const serverSideColumns = [
  {
    name: 'ID',
    sortable: true,
    maxWidth: '100px',
    selector: row => row.id
  },
  {
    name: 'Title',
    sortable: true,
    minWidth: '480px',
    selector: row => row.title
  },
  {
    name: 'Date',
    sortable: true,
    minWidth: '220px',
    selector: row => row.date
  },
  {
    name: 'ResourceID',
    sortable: true,
    minWidth: '30px',
    selector: row => row.resourceId
  },
  {
    name: 'Thumbnail',
    sortable: true,
    minWidth: '350px',
    selector: row => row.thumbnail
  },
]

// ** Table Adv Search Column
export const advSearchColumns = [
  {
    name: 'ID',
    sortable: true,
    maxWidth: '100px',
    selector: row => row.id
  },
  {
    name: 'Title',
    sortable: true,
    minWidth: '480px',
    selector: row => row.title
  },
  {
    name: 'Date',
    sortable: true,
    minWidth: '220px',
    selector: row => row.date
  },
  {
    name: 'ResourceID',
    sortable: true,
    minWidth: '30px',
    selector: row => row.resourceId
  },
  {
    name: 'Thumbnail',
    sortable: true,
    minWidth: '350px',
    selector: row => row.thumbnail
  },
]

export default serverSideColumns
