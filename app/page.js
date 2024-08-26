'use client'
import { useState } from 'react'
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Fade,
  Avatar
} from '@mui/material'
import UrlAdd from './components/url_add'
import Image from 'next/image'

export default function Home () {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`
    }
  ])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return // Prevent sending empty messages

    setLoading(true)
    setMessage('')
    setMessages(messages => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ])

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }])
    }).then(async res => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      return reader.read().then(function processText ({ done, value }) {
        if (done) {
          setLoading(false)
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages(messages => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text }
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='flex-start'
      sx={{
        backgroundColor: '#121212',
        color: '#e0e0e0',
        p: 2,
        overflow: 'hidden'
      }}
    >
      {/* Circular Logo at the top */}
      <Box mb={2} mt={1}>
        <Avatar
          sx={{ width: 80, height: 80 }} // Adjusted size to prevent overflow
        >
          <Image
            src='/logo.png'
            alt='Logo'
            layout='fill'
            style={{ borderRadius: '50%' }}
          />
        </Avatar>
      </Box>

      {/* Main content container */}
      <Stack
        direction='row'
        width='90%'
        height='calc(100vh - 150px)' // Reduced height to fit within the viewport
        spacing={4}
        alignItems='stretch'
        justifyContent='space-between'
        sx={{
          backgroundColor: '#1e1e1e',
          borderRadius: 3,
          p: 3,
          boxShadow: 4,
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#555',
            borderRadius: '4px'
          }
        }}
      >
        {/* URL scraping component */}
        <Box
          width='40%'
          sx={{
            borderRight: '1px solid #333',
            pr: 3,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#555',
              borderRadius: '4px'
            }
          }}
        >
          <Fade in timeout={600}>
            <Box>
              <Typography variant='h5' mb={2} color='#e0e0e0'>
                Scrape Reviews
              </Typography>
              <UrlAdd />
            </Box>
          </Fade>
        </Box>

        {/* Chat component */}
        <Box
          width='60%'
          pl={3}
          p={2}
          sx={{
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#555',
              borderRadius: '4px'
            }
          }}
        >
          <Fade in timeout={600}>
            <Stack
              direction={'column'}
              height='82%'
              spacing={3}
              sx={{
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#444 #121212'
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display='flex'
                  justifyContent={
                    message.role === 'assistant' ? 'flex-start' : 'flex-end'
                  }
                >
                  <Box
                    sx={{
                      backgroundColor:
                        message.role === 'assistant' ? '#333' : '#555',
                      color: 'white',
                      borderRadius: 2,
                      p: 2,
                      maxWidth: '75%',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Fade>

          {/* Input and Send Button */}
          <Stack direction={'row'} spacing={2} mt={3}>
            <TextField
              label='Message'
              fullWidth
              value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={loading}
              sx={{ backgroundColor: '#2c2c2c', borderRadius: 1 }}
              InputLabelProps={{ style: { color: '#e0e0e0' } }}
              InputProps={{ style: { color: '#e0e0e0' } }}
            />
            <Button
              variant='contained'
              onClick={sendMessage}
              disabled={loading}
              sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#555' } }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Send'
              )}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
