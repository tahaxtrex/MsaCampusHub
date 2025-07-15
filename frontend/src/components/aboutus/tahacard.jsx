import ProfileCard from "./profile";

function Taha() {
  return (
    <>

        <ProfileCard
        name="Taha Hbirri"
        title="Computer Science Student"
        handle="Taha"
        status="Online"
        contactText="Contact Me"
        avatarUrl="../assets/me.png"
        showUserInfo={true}
        enableTilt={true}
        onContactClick={() => console.log('Contact clicked')}
        />
    </>
  );
}


export default Taha
