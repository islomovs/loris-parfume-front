import React from 'react'
import { Box, Center, Spinner } from '@chakra-ui/react'
import './styles.css'

function Marker({ hover, isLoading }: { hover: boolean; isLoading: boolean }) {
  return (
    <Box
      className={`marker ${hover ? 'hover' : ''}`}
      transform={`translate(-50%, calc(-50% - 35px ))`}
    >
      <Center className="head" bgColor={'#EC5962'}>
        <Spinner color="white" opacity={isLoading ? 1 : 0} />
      </Center>
      <div className="stick" />
      <div className="shadow" />
    </Box>
  )
}

export default Marker
