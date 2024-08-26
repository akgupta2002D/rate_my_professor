'use client'
import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material'

export default function Home () {
  const [url, setUrl] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setResponse('')
    setLoading(true)

    try {
      const res = await fetch('/api/url_scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })

      if (!res.ok) {
        throw new Error('Failed to scrape the URL')
      }

      const data = await res.json()
      setResponse(data.message)
    } catch (error) {
      console.error(error)
      setResponse('An error occurred while scraping the URL.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        URL Scraper and Llama Integration
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label='Enter URL'
          variant='outlined'
          fullWidth
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Scrape URL'}
        </Button>
      </Box>
      {response && (
        <Box sx={{ mt: 4 }}>
          <Typography variant='h6'>Response:</Typography>
          <Typography variant='body1' color='text.secondary'>
            {response}
          </Typography>
        </Box>
      )}
    </Container>
  )
}
