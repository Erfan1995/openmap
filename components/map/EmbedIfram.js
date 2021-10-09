const EmbedIfram= ()=>{
    return <div dangerouslySetInnerHTML={{ __html: `<iframe width="100%" height="520" frameborder="0" src="http://localhost:3000/embed?mapToken=1df4ef0f2222f28e4dca4bc8871e2e26754c288d&id=1761" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>`}} />; 
}

export default EmbedIfram;