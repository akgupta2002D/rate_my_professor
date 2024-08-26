'use client'
import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  Fade
} from '@mui/material'

export default function Home () {
  const [url, setUrl] = useState('')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false) // For animation

  const handleSubmit = async e => {
    e.preventDefault()
    setReviews([])
    setLoading(true)
    setLoaded(false) // Reset animation state

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

      // Parse llamaSummary JSON string
      const parsedSummary = JSON.parse(data.summary)

      // Extract reviews from the parsed JSON response
      if (parsedSummary.reviews && Array.isArray(parsedSummary.reviews)) {
        setReviews(parsedSummary.reviews)
      } else {
        setReviews([
          { review: 'No reviews found or unable to parse response.' }
        ])
      }

      setLoaded(true) // Trigger animation when data is loaded
    } catch (error) {
      console.error(error)
      setReviews([{ review: 'An error occurred while scraping the URL.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      maxWidth='sm'
      sx={{
        mt: 8,
        backgroundColor: '#1e1e1e', // Dark background
        borderRadius: 2,
        p: 4,
        color: '#e0e0e0' // Light text color for readability
      }}
    >
      <Typography
        variant='h4'
        component='h1'
        gutterBottom
        align='center'
        sx={{ color: '#e0e0e0' }}
      >
        Enter a Professor&apos;s URL
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label='Enter URL'
          variant='outlined'
          fullWidth
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
          sx={{
            mb: 2,
            backgroundColor: '#2c2c2c', // Darker input background
            borderRadius: 1,
            input: { color: '#e0e0e0' }, // Light text color
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#444' // Light border for inputs
              },
              '&:hover fieldset': {
                borderColor: '#666' // Darker on hover
              }
            }
          }}
          InputLabelProps={{ style: { color: '#e0e0e0' } }} // Light label color
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={loading}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            bgcolor: '#333', // Button background color
            color: '#e0e0e0', // Button text color
            '&:hover': {
              bgcolor: '#555' // Hover color
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Scrape URL'
          )}
        </Button>
      </Box>
      <Divider sx={{ my: 4, backgroundColor: '#444' }} />
      {reviews.length > 0 && (
        <Fade in={loaded} timeout={600}>
          <Box
            sx={{
              maxHeight: 400,
              overflowY: 'auto',
              bgcolor: '#2c2c2c', // Darker background for the review section
              p: 2,
              borderRadius: 2,
              color: '#e0e0e0',
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#555',
                borderRadius: '4px'
              }
            }}
          >
            <Typography
              variant='h6'
              align='center'
              gutterBottom
              sx={{ color: '#e0e0e0' }}
            >
              Extracted Reviews
            </Typography>
            <List>
              {reviews.map((review, index) => (
                <Card
                  key={index}
                  variant='outlined'
                  sx={{
                    mb: 2,
                    backgroundColor: '#333', // Card background color
                    color: '#e0e0e0', // Text color
                    borderColor: '#444' // Card border color
                  }}
                >
                  <CardHeader
                    title={review.professor || 'Unknown'}
                    subheader={`Subject: ${review.subject || 'N/A'}`}
                    sx={{ color: '#e0e0e0' }} // Header text color
                  />
                  <CardContent>
                    <Typography variant='body2' color='#b0b0b0'>
                      {`Rating: ${review.stars || 'N/A'} stars`}
                    </Typography>
                    <Typography variant='body2' color='#b0b0b0'>
                      {`Review: ${review.review || 'No review available'}`}
                    </Typography>
                    <Typography variant='body2' color='#b0b0b0'>
                      {`Date: ${
                        new Date(review.date).toLocaleDateString() || 'Unknown'
                      }`}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </List>
          </Box>
        </Fade>
      )}
    </Container>
  )
}
