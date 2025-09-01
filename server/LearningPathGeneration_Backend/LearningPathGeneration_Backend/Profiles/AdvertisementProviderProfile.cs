using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Models;
using AutoMapper;

namespace LearningPathGeneration_Backend.Profiles
{
    public class AdvertisementProviderProfile:Profile
    {
        public AdvertisementProviderProfile()
        {
            CreateMap<AdvertisementProvider, AdvertisemntProviderDto>()
                .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src =>
                    src.AdvertisementProviderSpecifications.Select(s => s.Specification)));

            CreateMap<CreateAdvertisementProviderDto, AdvertisementProvider>();
        }
    }
}
