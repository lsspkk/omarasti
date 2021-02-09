import {
  atom,
  useRecoilState,
} from 'recoil'

const positionsState = atom({
  key: 'positionsState',
  default: [],
})

const designModeState = atom({
  key: 'designModeState',
  default: 'add',
})



const DesignMenu = (props) => {
  const [mode, setMode] = useRecoilState(designModeState)
  const normal = 'bg-orange-400 rounded hover:bg-orange-700 p-2 mx-4'
  const selected = 'bg-orange-600 rounded p-2 mx-4'

  return (
    <div className='container flex'>
      <p className='p-2'>Tee rata: </p>
      <button
        className={mode === 'add' ? selected : normal}
        onClick={() => setMode('add')}>
        Lisää
      </button>
      <button
        className={mode === 'move' ? selected : normal}
        onClick={() => setMode('move')}>
        Siirrä
      </button>
      <button
        className={mode === 'remove' ? selected : normal}
        onClick={() => setMode('remove')}>
        Poista
      </button>
      {props.children}
    </div>
  )
}

export { DesignMenu, positionsState, designModeState }
