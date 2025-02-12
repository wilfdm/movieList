import React from 'react'

export const Search = ({ searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
        <div>
            <img src='./src/assets/search.svg'alt='search'/>
            <input
                type='text'
                placeholder='Search through thousands of movies'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // ✅ Corrección

            />
        </div>
    </div>
  )
}

export default Search