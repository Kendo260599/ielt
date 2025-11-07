import React from 'react';

interface LandingPageViewProps {
    onStartLearningGuest: () => void;
    onRequestSignIn: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-surface p-6 rounded-xl border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="w-12 h-12 flex items-center justify-center bg-primary-light text-primary-text rounded-lg mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-secondary">{description}</p>
    </div>
);

const LandingPageView: React.FC<LandingPageViewProps> = ({ onStartLearningGuest, onRequestSignIn }) => {
    return (
        <div className="w-full animate-fade-in text-center">
            {/* Hero Section */}
            <section className="py-20 sm:py-28">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tighter mb-6 animate-fade-in-up">
                        Chinh phục Từ vựng IELTS cùng Trí tuệ Nhân tạo
                    </h1>
                    <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        Nền tảng học tập thông minh, cá nhân hóa lộ trình và tối ưu hóa kết quả của bạn với sức mạnh từ Google Gemini.
                    </p>
                    <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <button
                            onClick={onStartLearningGuest}
                            className="px-8 py-4 text-lg font-bold text-white bg-primary rounded-lg shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-start transform hover:scale-105 transition-all duration-200"
                        >
                            Bắt đầu học ngay
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-surface-muted -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
                 <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Tại sao chọn IELTS Scholar?</h2>
                    <p className="text-lg text-secondary mb-12">Công cụ bạn cần để thành công.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>}
                                title="Lộ trình Cá nhân hóa"
                                description="Bài kiểm tra đầu vào xác định trình độ và Gemini đề xuất các chủ đề phù hợp."
                            />
                        </div>
                         <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>}
                                title="Học tập Thông minh"
                                description="Flashcards, bài tập đa dạng và giải thích chi tiết giúp bạn ghi nhớ sâu."
                            />
                        </div>
                        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v1.5m-6 0V5.25a6 6 0 0 1 6-6v1.5m0 0v1.5m0-1.5a6 6 0 0 0 0 12m0 0v-1.5" /></svg>}
                                title="Luyện Nói với AI"
                                description="Mô phỏng kỳ thi thật, nhận phản hồi chi tiết về phát âm, ngữ pháp và sự trôi chảy."
                            />
                        </div>
                        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>}
                                title="Theo dõi Tiến độ"
                                description="Điểm Fluency Score, chuỗi học và thành tích giúp bạn luôn có động lực."
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Final CTA */}
            <section className="py-20 sm:py-28">
                 <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                        Sẵn sàng bứt phá band điểm của bạn?
                    </h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto mb-10">
                        Tham gia cộng đồng IELTS Scholar và bắt đầu hành trình chinh phục mục tiêu của bạn ngay hôm nay.
                    </p>
                     <button
                        onClick={onStartLearningGuest}
                        className="px-8 py-4 text-lg font-bold text-white bg-primary rounded-lg shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-start transform hover:scale-105 transition-all duration-200"
                    >
                        Bắt đầu miễn phí
                    </button>
                </div>
            </section>

             <footer className="text-center p-4 text-sm text-secondary border-t border-border">
                <p>Phát triển với Google Gemini API. © 2024 IELTS Scholar.</p>
            </footer>
        </div>
    );
};

export default LandingPageView;