import React, { useState } from 'react';

interface TopicSelectorProps {
  topics: string[]; // Now used for suggested topics
  onSelectTopic: (topic: string) => void;
  onStartPractice: (topic: string) => void;
  onBack: () => void;
  completedTopics: string[];
  favoriteTopics: string[];
  difficultTopics: string[];
  onToggleFavorite: (topic: string) => void;
  onToggleDifficult: (topic: string) => void;
  isGuest: boolean;
}

const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /> </svg> );
const StarOutline = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /> </svg> );
const StarSolid = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400"> <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.822 3.758 4.144.604c.729.106 1.018.996.49 1.505l-2.997 2.92.707 4.127c.124.725-.636 1.282-1.28.944l-3.706-1.948-3.706 1.948c-.644.338-1.405-.219-1.28-.944l.707-4.127-2.997-2.92c-.528-.509-.239-1.399.49-1.505l4.144-.604 1.822-3.758Z" clipRule="evenodd" /> </svg> );
const FlagOutline = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" /> </svg> );
const FlagSolid = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-error"> <path d="M3.5 2.75a.75.75 0 0 0-1.5 0v14.5a.75.75 0 0 0 1.5 0v-4.392l1.657-.348a6.44 6.44 0 0 1 3.26.316l.515.155a3.615 3.615 0 0 0 2.848 0l.515-.155a6.44 6.44 0 0 1 3.26-.316l1.657.348V2.75a.75.75 0 0 0-1.5 0v3.82a6.44 6.44 0 0 1-3.26-.316l-.515-.155a3.615 3.615 0 0 0-2.848 0l-.515.155a6.44 6.44 0 0 1-3.26.316V2.75Z" /> </svg> );
const PracticeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>);
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>);


interface TopicListProps {
    title: string;
    topicList: string[];
    onSelectTopic: (topic: string) => void;
    onStartPractice: (topic: string) => void;
    onToggleFavorite: (topic: string) => void;
    onToggleDifficult: (topic: string) => void;
    favoriteTopics: string[];
    difficultTopics: string[];
    isGuest: boolean;
    icon?: React.ReactNode;
}

const TopicList: React.FC<TopicListProps> = ({ title, topicList, icon, ...props }) => {
    if (topicList.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                {icon}
                {title}
            </h3>
            <div className="space-y-2">
                {topicList.map(topic => (
                    <TopicItem key={topic} topic={topic} {...props} />
                ))}
            </div>
        </div>
    );
};

interface TopicItemProps {
    topic: string;
    onSelectTopic: (topic: string) => void;
    onStartPractice: (topic: string) => void;
    onToggleFavorite: (topic: string) => void;
    onToggleDifficult: (topic: string) => void;
    favoriteTopics: string[];
    difficultTopics: string[];
    isGuest: boolean;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic, onSelectTopic, onStartPractice, onToggleFavorite, onToggleDifficult, favoriteTopics, difficultTopics, isGuest }) => {
    const isFavorite = favoriteTopics.includes(topic);
    const isDifficult = difficultTopics.includes(topic);

    return (
        <div className="group flex items-center justify-between bg-surface p-3 rounded-xl hover:shadow-md transition-shadow border border-border">
            <button onClick={() => onSelectTopic(topic)} className="flex-grow text-left">
                <span className="font-medium text-primary">{topic}</span>
            </button>
            <div className="flex items-center gap-2">
                {isFavorite && <StarSolid />}
                {isDifficult && <FlagSolid />}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isGuest && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(topic); }} className="p-1.5 rounded-full bg-surface-muted hover:bg-border transition-colors" aria-label="Mark as favorite">
                            {isFavorite ? <StarSolid /> : <StarOutline />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onToggleDifficult(topic); }} className="p-1.5 rounded-full bg-surface-muted hover:bg-border transition-colors" aria-label="Mark as difficult">
                            {isDifficult ? <FlagSolid /> : <FlagOutline />}
                        </button>
                      </>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onStartPractice(topic); }} className="p-1.5 rounded-full bg-surface-muted hover:bg-border transition-colors" aria-label="Start practice session">
                        <PracticeIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};


const TopicSelector: React.FC<TopicSelectorProps> = (props) => {
    const { onSelectTopic, onBack, topics: suggestedTopics, completedTopics } = props;
    const [customTopic, setCustomTopic] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customTopic.trim()) {
            onSelectTopic(customTopic.trim());
        }
    };

    return (
        <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-lg border border-border animate-scale-in">
            <div className="relative flex justify-center items-center mb-6">
                 <button 
                    onClick={onBack}
                    className="absolute left-0 flex items-center px-4 py-2 text-sm font-medium text-secondary bg-surface rounded-lg border border-border hover:bg-surface-muted transition-colors"
                >
                    <BackArrowIcon />
                    Chọn lại Level
                </button>
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary">Chọn Chủ đề</h2>
                    <p className="text-secondary mt-1">Nhập một chủ đề, hoặc chọn từ danh sách bên dưới.</p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Ví dụ: Space Exploration, Sustainable Energy..."
                    className="flex-grow w-full p-3 rounded-xl border-2 border-border bg-surface-muted focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
                <button type="submit" className="px-6 py-3 btn-primary" disabled={!customTopic.trim()}>
                    Tạo
                </button>
            </form>

            {suggestedTopics.length > 0 && (
                 <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-3">Gợi ý cho bạn</h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestedTopics.map(topic => (
                            <button
                                key={topic}
                                onClick={() => onSelectTopic(topic)}
                                className="px-4 py-2 text-sm font-medium bg-primary-light text-primary-text rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <TopicList title="Chủ đề cần ôn tập" topicList={props.difficultTopics} icon={<FlagSolid />} {...props} />
            <TopicList title="Chủ đề yêu thích" topicList={props.favoriteTopics} icon={<StarSolid />} {...props} />
            <TopicList title="Chủ đề đã hoàn thành" topicList={completedTopics.filter(t => !props.favoriteTopics.includes(t) && !props.difficultTopics.includes(t))} icon={<CheckCircleIcon />} {...props} />

        </div>
    );
};

export default TopicSelector;