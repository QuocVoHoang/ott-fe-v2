import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../../../app/[locale]/page'
 
describe('Page', () => {
  it('renders a text', () => {
    render(<Page />)
 
    expect(screen.getByText("Home")).toBeInTheDocument();
  })
})