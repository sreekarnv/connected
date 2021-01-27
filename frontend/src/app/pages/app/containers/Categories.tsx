import React from 'react';
import { Image, Text, Flex, Grid, Heading } from '@chakra-ui/react';

import GroupImage from './../../../../assets/images/sidebar/group.svg';
import { motion } from 'framer-motion';

const Categories = () => {
	return (
		<>
			<Heading
				mt={5}
				colorScheme='gray'
				textTransform='uppercase'
				size='2xl'
				fontWeight={400}
				textAlign='center'>
				Categories
			</Heading>
			<Grid
				rowGap={10}
				p={10}
				templateColumns='repeat(auto-fit, minmax(14rem, 1fr))'
				alignItems='start'
				justifyItems='center'>
				<motion.span
					style={{ backfaceVisibility: 'hidden' }}
					initial={{ scale: 0.95, opacity: 0, y: '-10px' }}
					animate={{
						scale: 1,
						opacity: 1,
						y: 0,
						transition: { duration: 0.7, ease: 'backInOut' },
					}}>
					<Flex
						w='max-content'
						cursor='pointer'
						p={10}
						bg='primary.600'
						borderRadius={10}
						direction='column'
						className='category-item'
						transition='all .3s ease-out'
						_hover={{
							transform: 'scale(1.03)',
						}}>
						<Image
							borderRadius={3}
							boxSize='100px'
							src={GroupImage}
							alt='Segun Adebayo'
						/>
						<Text
							textTransform='uppercase'
							mt={5}
							alignSelf='center'
							w='max-content'>
							Categories
						</Text>
					</Flex>
				</motion.span>

				<motion.span
					style={{ backfaceVisibility: 'hidden' }}
					initial={{ scale: 0.95, opacity: 0, y: '-10px' }}
					animate={{
						scale: 1,
						opacity: 1,
						y: 0,
						transition: { duration: 0.7, ease: 'backInOut' },
					}}>
					<Flex
						w='max-content'
						cursor='pointer'
						p={10}
						bg='primary.600'
						borderRadius={10}
						direction='column'
						className='category-item'
						transition='all .3s ease-out'
						_hover={{
							transform: 'scale(1.03)',
						}}>
						<Image
							borderRadius={3}
							boxSize='100px'
							src={GroupImage}
							alt='Segun Adebayo'
						/>
						<Text
							textTransform='uppercase'
							mt={5}
							alignSelf='center'
							w='max-content'>
							Categories
						</Text>
					</Flex>
				</motion.span>

				<motion.span
					style={{ backfaceVisibility: 'hidden' }}
					initial={{ scale: 0.95, opacity: 0, y: '-10px' }}
					animate={{
						scale: 1,
						opacity: 1,
						y: 0,
						transition: { duration: 0.7, ease: 'backInOut' },
					}}>
					<Flex
						w='max-content'
						cursor='pointer'
						p={10}
						bg='primary.600'
						borderRadius={10}
						direction='column'
						className='category-item'
						transition='all .3s ease-out'
						_hover={{
							transform: 'scale(1.03)',
						}}>
						<Image
							borderRadius={3}
							boxSize='100px'
							src={GroupImage}
							alt='Segun Adebayo'
						/>
						<Text
							textTransform='uppercase'
							mt={5}
							alignSelf='center'
							w='max-content'>
							Categories
						</Text>
					</Flex>
				</motion.span>

				<motion.span
					style={{ backfaceVisibility: 'hidden' }}
					initial={{ scale: 0.95, opacity: 0, y: '-10px' }}
					animate={{
						scale: 1,
						opacity: 1,
						y: 0,
						transition: { duration: 0.7, ease: 'backInOut' },
					}}>
					<Flex
						w='max-content'
						cursor='pointer'
						p={10}
						bg='primary.600'
						borderRadius={10}
						direction='column'
						className='category-item'
						transition='all .3s ease-out'
						_hover={{
							transform: 'scale(1.03)',
						}}>
						<Image
							borderRadius={3}
							boxSize='100px'
							src={GroupImage}
							alt='Segun Adebayo'
						/>
						<Text
							textTransform='uppercase'
							mt={5}
							alignSelf='center'
							w='max-content'>
							Categories
						</Text>
					</Flex>
				</motion.span>

				<motion.span
					style={{ backfaceVisibility: 'hidden' }}
					initial={{ scale: 0.95, opacity: 0, y: '-10px' }}
					animate={{
						scale: 1,
						opacity: 1,
						y: 0,
						transition: { duration: 0.7, ease: 'backInOut' },
					}}>
					<Flex
						w='max-content'
						cursor='pointer'
						p={10}
						bg='primary.600'
						borderRadius={10}
						direction='column'
						className='category-item'
						transition='all .3s ease-out'
						_hover={{
							transform: 'scale(1.03)',
						}}>
						<Image
							borderRadius={3}
							boxSize='100px'
							src={GroupImage}
							alt='Segun Adebayo'
						/>
						<Text
							textTransform='uppercase'
							mt={5}
							alignSelf='center'
							w='max-content'>
							Categories
						</Text>
					</Flex>
				</motion.span>

				<motion.span
					style={{ backfaceVisibility: 'hidden' }}
					initial={{ scale: 0.95, opacity: 0, y: '-10px' }}
					animate={{
						scale: 1,
						opacity: 1,
						y: 0,
						transition: { duration: 0.7, ease: 'backInOut' },
					}}>
					<Flex
						w='max-content'
						cursor='pointer'
						p={10}
						bg='primary.600'
						borderRadius={10}
						direction='column'
						className='category-item'
						transition='all .3s ease-out'
						_hover={{
							transform: 'scale(1.03)',
						}}>
						<Image
							borderRadius={3}
							boxSize='100px'
							src={GroupImage}
							alt='Segun Adebayo'
						/>
						<Text
							textTransform='uppercase'
							mt={5}
							alignSelf='center'
							w='max-content'>
							Categories
						</Text>
					</Flex>
				</motion.span>

				<motion.span
					style={{ backfaceVisibility: 'hidden' }}
					initial={{ scale: 0.95, opacity: 0, y: '-10px' }}
					animate={{
						scale: 1,
						opacity: 1,
						y: 0,
						transition: { duration: 0.7, ease: 'backInOut' },
					}}>
					<Flex
						w='max-content'
						cursor='pointer'
						p={10}
						bg='primary.600'
						borderRadius={10}
						direction='column'
						className='category-item'
						transition='all .3s ease-out'
						_hover={{
							transform: 'scale(1.03)',
						}}>
						<Image
							borderRadius={3}
							boxSize='100px'
							src={GroupImage}
							alt='Segun Adebayo'
						/>
						<Text
							textTransform='uppercase'
							mt={5}
							alignSelf='center'
							w='max-content'>
							Categories
						</Text>
					</Flex>
				</motion.span>

				<motion.span
					style={{ backfaceVisibility: 'hidden' }}
					initial={{ scale: 0.95, opacity: 0, y: '-10px' }}
					animate={{
						scale: 1,
						opacity: 1,
						y: 0,
						transition: { duration: 0.7, ease: 'backInOut' },
					}}>
					<Flex
						w='max-content'
						cursor='pointer'
						p={10}
						bg='primary.600'
						borderRadius={10}
						direction='column'
						className='category-item'
						transition='all .3s ease-out'
						_hover={{
							transform: 'scale(1.03)',
						}}>
						<Image
							borderRadius={3}
							boxSize='100px'
							src={GroupImage}
							alt='Segun Adebayo'
						/>
						<Text
							textTransform='uppercase'
							mt={5}
							alignSelf='center'
							w='max-content'>
							Categories
						</Text>
					</Flex>
				</motion.span>
			</Grid>
		</>
	);
};

export default Categories;
