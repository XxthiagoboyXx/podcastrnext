import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toogleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData); //o que ta ente parenteses é so o formato do dado, se for texto é string, se for inteiro é número


type PlayerContextProviderProps = {
    children: ReactNode; //porque ele pode aceitar qualqer coisa: tags html, textos simples, etc
};

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    //estados
    const [episodeList, setEpisodeList] = useState([]); //para poder alterar o status tem que usar essa função
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0); //inicia com 0
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    //

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying); //altaera o valor do set isplaying para o contrario dela
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toogleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState() { //limpa o Player, para ele ficar como se nunca tivesse tocado nada
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

            setCurrentEpisodeIndex(nextRandomEpisodeIndex);

        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            playList,
            playNext,
            playPrevious,
            isPlaying,
            isLooping,
            isShuffling,
            toggleLoop,
            togglePlay,
            toogleShuffle,
            setPlayingState,
            hasNext,
            hasPrevious,
            clearPlayerState,
        }}>
            {children} {/*Dizendo que o componente PlayerContextProvider aceita um conteúdo dentro dele*/}
        </PlayerContext.Provider>  //*pega o status da música

    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}