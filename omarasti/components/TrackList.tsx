import { useState } from 'react'
import { trackState } from '../models/state'
import { useRecoilState } from 'recoil'
import { Button } from './Buttons'
import { useRouter } from 'next/router'
import { designModeState, TrackViewMode } from './DesignMenu'
import { TrackDistance } from './Distance'
import { userState } from '../pages/settings'
import { TrackPopulatedType, TrackListType } from '../models/Track'
import { ConfirmationDialog } from './ConfirmationDialog'
import { Trash2, Edit, BarChart3, Play } from 'lucide-react'

interface TrackListProps {
  tracks: TrackListType[]
}

export const TrackList = ({ tracks }: TrackListProps) => {
  const [, setMode] = useRecoilState(designModeState)
  const [, setTrack] = useRecoilState(trackState)
  const [sorted, setSorted] = useState({ column: 'name', ascending: true })
  const [message, setMessage] = useState('')
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; trackId: string; trackName: string }>({
    isOpen: false,
    trackId: '',
    trackName: '',
  })
  const router = useRouter()

  const toUrl = (track: TrackListType, url: string, mode: TrackViewMode) => {
    setTrack(track as TrackPopulatedType)
    setMode(mode)
    router.push(url)
  }

  const showRemoveConfirmation = (id: string, name: string) => {
    setConfirmDialog({ isOpen: true, trackId: id, trackName: name })
  }

  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, trackId: '', trackName: '' })
  }

  const confirmRemove = async () => {
    const { trackId, trackName } = confirmDialog
    const url = `/api/tracks/${trackId}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    })

    setMessage(`Rata ${trackName} ${res.ok ? 'poistettu.' : 'Poistaminen epäonnistui'}`)
    setTimeout(() => setMessage(''), 3000)
    if (res.ok) {
      router.replace(router.asPath)
    }
  }

  if (!tracks) return <div />

  const changeSorted = (column, ascending) => setSorted({ column, ascending })

  const sortedTracks = tracks.sort((a, b) => {
    if (sorted.ascending) {
      return a[sorted.column].localeCompare(b[sorted.column])
    }
    return b[sorted.column].localeCompare(a[sorted.column])
  })

  return (
    <>
      {message !== '' && <div>{message}</div>}
      <SortMenu changeSorted={changeSorted} sorted={sorted} />
      {sortedTracks.map((track) => (
        <div key={track._id}>
          <TrackCard track={track} toUrl={toUrl} remove={showRemoveConfirmation} />
        </div>
      ))}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmRemove}
        title='Poista rata'
        message={`Oletko varma että haluat poistaa radan "${confirmDialog.trackName}"?`}
        confirmText='Kyllä'
        cancelText='Ei'
      />
    </>
  )
}

const SortMenu = ({ changeSorted, sorted }) => {
  const isName = sorted.column === 'name'

  const updateSorted = (column) => {
    const ascending = sorted.column !== column ? true : !sorted.ascending
    changeSorted(column, ascending)
  }

  return (
    <div className='flex justify-between mx-1'>
      <div className={`${isName && 'bold'} text-gray-800`} onClick={() => updateSorted('name')}>
        <SortIcon ascending={sorted.ascending} selected={isName} />
        Nimi
      </div>

      <div className={`${!isName && 'bold'} text-gray-800`} onClick={() => updateSorted('modified')}>
        Pvm
        <SortIcon ascending={sorted.ascending} selected={!isName} />
      </div>
    </div>
  )
}

const SortIcon = ({ ascending, selected }) => {
  return (
    <img
      style={{ width: '1.2em', height: 'auto', display: 'inline-block', opacity: selected ? '1' : '0.8' }}
      src={`${!selected ? '/none.svg' : ascending ? '/ascending.svg' : '/descending.svg'}`}
      className='mx-2'
    />
  )
}

const TrackCard = ({
  track,
  toUrl,
  remove,
}: {
  track: TrackListType
  toUrl: (track: TrackListType, url: string, mode: TrackViewMode) => void
  remove: (id: string, name: string) => void
}) => {
  const [user] = useRecoilState(userState)
  const [visible, setVisible] = useState(false)
  const [runAmounts, setRunAmounts] = useState<{ totalRuns: number; myRuns: number }>({ totalRuns: 0, myRuns: 0 })

  const changeVisibility = async () => {
    if (!visible) {
      const res = await fetch(`/api/run/track/${track._id}/show`)
      if (res.ok) {
        const { data } = await res.json()
        if (data.totalAmounts !== runAmounts?.totalRuns || data.myRuns !== runAmounts?.myRuns) {
          setRunAmounts(data)
        }
      }
    }
    setVisible(!visible)
  }

  const options = { year: 'numeric', month: 'numeric', day: 'numeric' } as Intl.DateTimeFormatOptions
  const modified = new Date(track.modified).toLocaleDateString('fi-FI', options)
  const color = track.published ? 'text-orange-900' : 'text-gray-600'
  const canSeeResults = runAmounts?.totalRuns > 1 && runAmounts?.myRuns > 0

  return (
    <div className='border-y border-orange-200 p-2 -mb-[2px]'>
      <div className='flex justify-between content-end' onClick={() => changeVisibility()}>
        <div className='select-none'>
          <div className={`inline-block ${color} bold text-xl `}>{track.name}</div>
          <div className='track-name '>{track.location !== '' && <> Sijainti: {track.location} </>}</div>
        </div>
        <div className='owner text-gray-600 text-sm text-right'>
          {modified}
          {visible && (
            <>
              <div>
                {track.owner === undefined ? (
                  ''
                ) : (
                  <>
                    <div style={{ fontSize: '0.8em', lineHeight: '0.7em' }}>Ratamestari</div>
                    {track.owner.name}
                  </>
                )}
              </div>
              {track.published === false && <div style={{ fontSize: '0.8em' }}>Ei julkaistu</div>}
            </>
          )}
        </div>
      </div>

      <div
        className='flex justify-between selected'
        style={{ maxHeight: !visible ? '0px' : 'none', transition: 'max-height 0.5s' }}
      >
        {visible && (
          <>
            <div>
              <TrackDistance markers={track.markers} />
            </div>
            <div className='flex justify-end items-end gap-2 md:gap-8'>
              {track.owner._id === user?.id && (
                <Button
                  className='mr-2 md:mr-4'
                  onClick={() => remove(track._id, track.name)}
                  icon={Trash2}
                  iconOnly={true}
                  variant='secondary'
                >
                  Poista
                </Button>
              )}

              {!track.published && (
                <Button onClick={() => toUrl(track, '/tracks/edit', 'move')} icon={Edit} iconOnly>
                  Muokkaa
                </Button>
              )}

              {canSeeResults && (
                <Button className='self-end' onClick={() => toUrl(track, '/results', 'view')} icon={BarChart3} iconOnly>
                  Tulokset
                </Button>
              )}
              <Button className='mr-0' onClick={() => toUrl(track, '/tracks/view', 'view')}>
                Suunnista
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
