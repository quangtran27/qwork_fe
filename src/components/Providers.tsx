import { store } from '@/redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

const queryCLient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})

function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryCLient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  )
}

export default Providers
