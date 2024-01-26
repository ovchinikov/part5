import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import Togglable from './togglable'
import userEvent from '@testing-library/user-event'
import CreateBlog from './createblog'

describe('test blog and like buttons', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Maskim',
    url: 'https://reactpatterns.com/',
    likes: 5,
  }
  const user = {
    username: 'vlad',
  }
  test('renders content', () => {
    const { container } = render(<Blog blog={blog} user={user} />)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Component testing is done with react-testing-library Maskim',
    )
    expect(div).toBeDefined()
    const showWhenVisible = document.querySelector('.showWhenVisible')
    expect(showWhenVisible).toHaveTextContent('https://reactpatterns.com/')
    expect(showWhenVisible).toHaveTextContent(5)
  })

  test('like buttons', async () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} increaseLikes={mockHandler} user={user} />)
    const user1 = userEvent.setup()
    const button = screen.getByText('like')
    await user1.click(button)
    await user1.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

// test button clicks

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel='show...'>
        <div className='testDiv'>togglable content</div>
      </Togglable>,
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})

test('<createBlog /> updates parent state and calls onSubmit', async () => {
  const mockHandler = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<CreateBlog createBlog={mockHandler} />)

  const input = container.querySelector('#title')
  const button = screen.getByText('Add')

  await user.type(input, 'hello world!')
  await userEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('hello world!')
})
