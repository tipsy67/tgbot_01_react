export default function ReferralButton({ userUIID, ...props }) {
    const generateReferralLink = () => {
        // const baseUrl = window.location.href.split('?')[0];
        return `https://t.me/dantoropov_test_bot?start=${userUIID}`;
    };

const handleShare = async () => {
    if (!userUIID) return;

    const referralLink = generateReferralLink();
    const shareText = `Присоединяйся к розыгрышу призов! 🎉`;

    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(
            `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`
        );
    } else if (navigator.share) {
        await navigator.share({
            title: 'Приглашение в розыгрыш',
            text: shareText,
            url: referralLink
        });
    } else {
        copyToClipboard(`${shareText} ${referralLink}`);
    }
};

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Сообщение скопировано! Отправьте его другу в Telegram');
            })
            .catch(() => {
                prompt('Скопируйте сообщение и отправьте другу:', text);
            });
    };

    return (
        <button
            onClick={handleShare}
            className={`btn bg-secondary/50 border-secondary/50 text-white mt-4 gap-2 w-full hover:scale-105 transition-transform duration-200`}
            // className={`btn btn-primary mt-4 gap-2 w-full hover:scale-105 transition-transform duration-200`}
            disabled={!userUIID}
            {...props}
        >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
            {userUIID ? 'Пригласить друзей' : 'Загрузка...'}
        </button>
    );
}

