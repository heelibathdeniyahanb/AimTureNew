using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Models;
using AutoMapper;

namespace LearningPathGeneration_Backend.Profiles
{
    public class AdvertisementProfile:Profile
    {
        public AdvertisementProfile()
        {
            CreateMap<Advertisement, AdvertisementDto>();
            CreateMap<CreateAdvertisementDto, Advertisement>();
            CreateMap<UpdateAdvertisementDto, Advertisement>();
        }
    }
}
