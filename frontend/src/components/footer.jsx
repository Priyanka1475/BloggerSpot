

const Footer = () => {
  return (
    <>
    <div className= "wt-8 w-full bg-black px-8 md: px-[500px] flex md:flex-row flex-col  space-y-4 md: space-y-0 items-start justify-between text-sm md: text-md py-8 md: wt-8">
      <div className = "flex flex-col text-white ">
        <p>Featured 8 logs</p>
        <p>Most viewed </p>
        <p>Readers choice</p>
      </div>
      <div className = "flex flex-col text-white ">
        <p>Forum</p>
        <p>Support </p>
        <p>Recent posts</p>
      </div>
      <div className = "flex flex-col text-white ">
        <p>Privacy Policy</p>
        <p>About us</p>
        <p>Terms and Conditions</p>
        <p>Terms of Service</p>
      </div>
    </div>
    <p className = "py-2 pb-6 text-center text-white bg-black text-sm">All rights reserved </p>
    </>
  )
}

export default Footer
