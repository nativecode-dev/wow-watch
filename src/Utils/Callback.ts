export type Callback<T> = (value: T) => void
export type CallbackReturn<T, U> = (value: T) => U
export type NodeCallback<T> = (error: Error | undefined, value: T) => void
