import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null); // criando referencia para poder manipular o áudio
    const [progress, setProgress] = useState(0);
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toogleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState,
    } = usePlayer(); //passar informações entre componentes

    useEffect(() => {
        if (!audioRef.current) { //se nao existir
            return;
        }

        if (isPlaying) {
            audioRef.current.play(); //para dar play
        } else {
            audioRef.current.pause(); //para dar pause
        }
    }, [isPlaying]) //essa função vai disparar toda vez que isPlaying tiver seu valor alterado

    function setupProgressListener() {
        audioRef.current.currentTime = 0; //para sempre que mudar de episodio resetar o tempo para 0

        audioRef.current.addEventListener('timeupdate', () => { //o evento do timeupdate é liberado várias vezes enquanto o áudio está tocando
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount; // muda o tempo real do audio
        setProgress(amount); //muda o progresso do tempo para o usuario ver
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )} {/*condicional formal, lê-se: se episode!=null então mostrar o que está dentro dos parênteses*/}

            <footer className={!episode ? styles.empty : ''}> {/*Existe um episódio tocando? se nao existir a classe é styles.empty */}
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration} //tempo maximo em segundos do slider
                                value={progress} //o value é o tanto que e o episódio ja progrediu
                                onChange={handleSeek} //o que acontece quando o usuario arrasta a bolinha
                                trackStyle={{ backgroundColor: '#04D361' }} //o que ja passou
                                railStyle={{ backgroundColor: '#9F75FF' }} //a cor de fundo
                                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }} //a cor do ponteiro e o tomanho da borda
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span> {/*a interrogação serve para checar se o episodio existir, caso nao exista ele nao irá definir como 0*/}
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)}
                        onEnded={handleEpisodeEnded}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}{/*um tipo de if lógico*/}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length == 1}
                        onClick={toogleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying
                            ? <img src="/pause.svg" alt="Tocar" />
                            : <img src="/play.svg" alt="Pausar" />}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>

                </div>

            </footer>
        </div>
    );
}