'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import ReactPaginate from 'react-paginate';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import axios from '@component/components/axios/axios';
import { stateContext } from '@component/components/Context/StateProvider';
import Addvehicle from '@component/components/Addvehicle';
import '@component/components/css/Styles.css'
import * as FileSaver from 'file-saver';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';

export default function dashboard() {
    const session = useSession();
    const router = useRouter();
    const [page, setPage] = useState(0)
    const [data, setData] = useState([])
    const [model, setModel] = useState('ALL')
    const [message, setMessage] = useState('')
    const { showAddVehicle } = useContext(stateContext);
    const [excelDate,setExcelDate] = useState({
        startDate: '',
        endDate: ''
    })
    const loop = [...Array(data?.getall && (10 - data.getall.length)).keys()]

    useEffect(() => {
        if(session.status === 'unauthenticated'){
            router?.push("/login")
        }
      },[session,router])


    // const fetcher = (...args) => fetch(...args).then(res => res.json())
    // const { data, error, isLoading } = useSWR(`/api/posts/${page}`, fetcher)
    // if (error) return <div>failed to load</div>
    // if (isLoading) return <div>loading...</div>

    useEffect(() => {
        axios.post(`/api/posts/${page}`, { model: model }).then((res) => { setData(res.data) })
    }, [page, model,message])


    const pageCount = Math.ceil(data.count / 10);

    function handlePageClick(e) {
        let newOffset = (e.selected * 1) % data.count;
        setPage(newOffset);
    }

    function sortby(e) {
        console.log(e.target.value)
        setModel(e.target.value)
        setPage(0)
    }
    function handleImageView(url) {
        if (url) {
            window.open(url, '_black')
        }
    }
    function convertDate(raw) {
        const date = new Date(raw);
        const dateDay = date.getDate();
        const dateMonth = date.getMonth() + 1;
        const dateYear = date.getFullYear();

        return `${dateDay}/${dateMonth}/${dateYear}`
    }

    function handleDate(e){
        const {name, value} = e.target;
        setExcelDate(prev => ({...prev, [name] : value}))
    }

    function generateExcelbyrange(e) {
        e.preventDefault()
            axios({
                method: 'post',
                url: '/api/posts/excel/byrange',
                data: excelDate,
                responseType : 'blob'
            }).then(response => {
                    const blob = new Blob([response.data]);
                    if(blob.size === 27){
                        alert('No Data Found')
                    }
                    else{
                        FileSaver.saveAs(blob, 'RURUTRACKING.xlsx');
                    }
            }).catch(err => {
                console.log(err)
            })
    }

    function generateExcelbyfilter(e) {
        e.preventDefault()
            axios({
                method: 'post',
                url: '/api/posts/excel/byfilter',
                data:  {model},
                responseType : 'blob'
            }).then(response => {
                    const blob = new Blob([response.data]);
                    if(blob.size === 27){
                        alert('No Data Found')
                    }
                    else{
                        FileSaver.saveAs(blob, 'RURUTRACKING.xlsx');
                    }
            }).catch(err => {
                console.log(err)
            })
    }
   async function handleDelete(e, id) {
        e.preventDefault();
        console.log(id)
        
      await axios({
            method: 'delete',
            url: `/api/delete/deleteentry/${id}`,
            responseType : 'application/json'
        }).then(response => {
            setMessage(response.data.message)
            setTimeout(() => {
                setMessage('')
            },1500)
        }).catch(err => {
            console.log(err)
        })
    }

    function convertTime(raw) {
        const date = new Date(raw);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    }

    if (session.status === 'loading') {
        return (
          <div className="flex justify-center">
            <BeatLoader color="#3b82f6" />
          </div>
        );
      }
      if (session.status === 'authenticated') {
    return (
        <div className='flex items-stretch h-full xs:flex-col 2xs:flex-col gap-3 xs:p-2 2xs:p-2'>
            {showAddVehicle && <Addvehicle></Addvehicle>}
            <div className={`flex-1 bg-white ${showAddVehicle ? 'w-4/5 2xs:w-full' : 'w-full'} p-4 rounded-md shadow-lg `}>
                <div className='flex justify-between mb-5 bg-white z-10'>
                    <div className=' text-sm 2xs:text-xs flex gap-5 sm:gap-1 xs:gap-1 2xs:gap-1 sm:flex-col xs:flex-col 2xs:flex-col items-center'>
                        <label>Filter by</label>
                        <select type='select' className=' border border-blue-700 py-1.5 px-2 xs:p-0.5 2xs:p-0.5 sm:w-20 xs:w-20 2xs:w-20' onChange={(e) => sortby(e)}>
                            <option value={'ALL'}>All</option>
                            {
                                data.vehiclemodel?.map((model, index) =>
                                    <option key={index} value={model.model}>{model.model}</option>
                                )
                            }
                        </select>
                            <button type='button' className='py-1.5 px-2 w-fit border border-green-700 bg-green-700 rounded-md text-white' onClick={generateExcelbyfilter}>Download by filter</button>

                    </div>
                   
                    <div className='flex items-center gap-3 text-sm'>
                        <div>
                            <input type='date' className="py-1 px-2 w-fit border  border-blue-300" name='startDate' value={excelDate.startDate} onChange={handleDate}></input>
                            <span> - </span>
                            <input type='date' className="py-1 px-2 w-fit border border-blue-300" name='endDate' value={excelDate.endDate} onChange={handleDate}></input>
                        </div>
                        <div>
                            <button type='button' className='py-1.5 px-2 w-fit border border-green-700 bg-green-700 rounded-md text-white' onClick={generateExcelbyrange}>Download by range</button>
                        </div>
                        
                    </div>
                </div>
                <div className='flex gap-6 text-sm 2xs:text-xs overflow-auto barOverflow h-[64vh]' id='overflowtry'>
                    <table className='w-full'>
                        <thead>
                            <tr>
                                <th className='px-5 py-2 border'>S.No</th>
                                <th className='px-5 py-2 border'>User</th>
                                <th className='px-5 py-2 border'>Username</th>
                                <th className='px-5 py-2 border'>Vehicle Model</th>
                                <th className='px-5 py-2 border'>Start KiloMeter</th>
                                <th className='px-5 py-2 border'>End KiloMeter</th>
                                <th className='px-5 py-2 border'>Start Date</th>
                                <th className='px-5 py-2 border'>End Date</th>
                                <th className='px-5 py-2 border'>Start Time</th>
                                <th className='px-5 py-2 border'>End Time</th>
                                <th className='px-5 py-2 border'>place</th>
                                <th className='px-5 py-2 border'>Start Image</th>
                                <th className='px-5 py-2 border'>End Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.getall?.map((data, index) =>
                                <tr key={index}>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{(index + 1) + page * 10}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.user}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.username}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.model}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.startkm}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.endkm}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.start_time !== null && convertDate(data.start_time)}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.end_time !== null && convertDate(data.end_time)}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.start_time !== null && convertTime(data.start_time)}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.end_time !== null && convertTime(data.end_time)}</td>
                                    <td className='px-5 py-2 border whitespace-nowrap'>{data.place}</td>
                                    <td className='px-5 py-2 border'>
                                        <div className='flex justify-center cursor-pointer' onClick={() => handleImageView(`${data.startimg && `http://172.16.0.100:8080/fleet/uploads/${data.startimg.replace(/\$/g, '').trim()}`}`)}>
                                            <div className='relative h-14 w-20' >
                                                <Image src={data.startimg ? `http://172.16.0.100:8080/fleet/uploads/${data.startimg.replace(/\$/g, '').trim()}` : '/noimg.jpg'} alt='NoImage.png' sizes={'(max-width: 1250px) 100vw, 1250px'} fill={true}></Image>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-5 py-2 border'>
                                        <div className='flex justify-center cursor-pointer' onClick={() => handleImageView(`${data.endimg && `http://172.16.0.100:8080/fleet/uploads/${data.endimg}`}`)}>
                                            <div className='relative h-14 w-20' >
                                                <Image src={data.endimg ? `http://172.16.0.100:8080/fleet/uploads/${data.endimg}` : '/noimg.jpg'} alt='NoImage.png' sizes={'(max-width: 1250px) 100vw, 1250px'} fill={true}></Image>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                    <div className='flex justify-center cursor-pointer' onClick={(e) => handleDelete(e, data.Id)}>Delete</div>
                                    </td>
                                </tr>)}
                            {
                                loop?.map((data) => <tr key={data} className='h-20 text-center'>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                    <td className='px-5 py-2 border'>-</td>
                                </tr>)
                            }
                        </tbody>
                    </table>

                </div>

                <div className='flex justify-end mt-3'>
                        <ReactPaginate
                            activeClassName={'bg-blue-500 text-white'}
                            breakClassName={'py-1 2xs:py-1 px-3 2xs:px-2 border border-r-0 border-blue-500 text-blue-800'}
                            breakLabel={'...'}
                            containerClassName={'flex items-center'}
                            disabledClassName={'disabled-page'}
                            marginPagesDisplayed={2}
                            nextClassName={"py-1 2xs:py-1 border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"}
                            nextLabel={<BiRightArrowAlt className='w-full h-full py-1 px-2 2xs:px-1' />}
                            onPageChange={(e) => handlePageClick(e)}
                            pageCount={pageCount}
                            pageLinkClassName={'px-3 2xs:px-2 py-[0.0.075rem] text-xs'}
                            pageClassName={'py-1 2xs:py-1 border border-r-0 border-blue-500  text-blue-600 hover:bg-blue-500 hover:text-white font-semibold '}
                            pageRangeDisplayed={2}
                            previousClassName={"py-1 2xs:py-1 border border-r-0 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"}
                            previousLabel={<BiLeftArrowAlt className='w-full h-full py-1 px-2 2xs:px-1 ' />}
                        />
                    </div>
            </div>
        </div>
    )
}}
