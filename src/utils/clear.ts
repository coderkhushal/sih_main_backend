import { DbManager}  from "./DbManager"
async function ClearTable(tableName :string){
    try{

        let prisma = DbManager.getInstance().getClient()   
        await prisma.$executeRaw`TRUNCATE TABLE "${tableName}" CASCADE`
        console.log(`Table ${tableName} cleared`)
    }
    catch(err){ 
        console.log(err)
    }
}
ClearTable("meeting")